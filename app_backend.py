from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="gateway01.eu-central-1.prod.aws.tidbcloud.com",
        user="4YczBAy4EkXu3NC.root",
        password="tpYZRFZdVmcrHY8h",
        database="scuola",
        port=4000
    )

def query_to_json(sql, params=None):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(sql, params or ())
        return cursor.fetchall()
    except Exception as e:
        print(f"Errore Query: {e}")
        return []
    finally:
        cursor.close()
        conn.close()

@app.route('/api/classi', methods=['GET'])
def get_classi():
    sql = "SELECT id_classe, nome, sezione, indirizzo, id_anno FROM classi"
    return jsonify(query_to_json(sql))

@app.route('/api/classi/<int:id_classe>', methods=['GET'])
def get_classe_by_id(id_classe):
    sql = "SELECT id_classe, nome, sezione, indirizzo, id_anno FROM classi WHERE id_classe = %s"
    res = query_to_json(sql, (id_classe,))
    if len(res) > 0: return jsonify(res[0])
    return jsonify({"error": "Classe non trovata"}), 404

@app.route('/api/studenti', methods=['GET'])
def get_studenti():
    id_classe = request.args.get('id_classe')
    if id_classe:
        sql = "SELECT id_studente, cognome, nome, codice_fiscale, data_nascita, id_classe FROM studenti WHERE id_classe = %s"
        res = query_to_json(sql, (id_classe,))
    else:
        sql = "SELECT id_studente, cognome, nome, codice_fiscale, data_nascita, id_classe FROM studenti"
        res = query_to_json(sql)
    return jsonify(res)

@app.route('/api/insegnamenti', methods=['GET'])
def get_insegnamenti():
    id_classe = request.args.get('id_classe')
    if id_classe:
        sql = """
        SELECT id_insegnamento, id_docente, id_materia, id_classe, giorno,
        TIME_FORMAT(ora_inizio, '%H:%i') AS ora_inizio, TIME_FORMAT(ora_fine, '%H:%i') AS ora_fine
        FROM insegnamenti WHERE id_classe = %s
        """
        return jsonify(query_to_json(sql, (id_classe,)))
    return jsonify([])

@app.route('/api/classi/<int:id_classe>/docenti', methods=['GET'])
def get_docenti_classe(id_classe):
    sql = """
    SELECT DISTINCT d.id_docente, d.cognome, d.nome, d.email, d.specializzazione
    FROM docenti d
    JOIN insegnamenti i ON d.id_docente = i.id_docente
    WHERE i.id_classe = %s
    """
    return jsonify(query_to_json(sql, (id_classe,)))

@app.route('/api/materie', methods=['GET'])
def get_materie():
    sql = "SELECT id_materia, nome FROM materie"
    return jsonify(query_to_json(sql))

@app.route('/api/studenti/<int:id_studente>', methods=['GET'])
def get_studente_by_id(id_studente):
    sql = "SELECT id_studente, cognome, nome, codice_fiscale, data_nascita, id_classe FROM studenti WHERE id_studente = %s"
    res = query_to_json(sql, (id_studente,))
    if len(res) > 0: return jsonify(res[0])
    return jsonify({"error": "Studente non trovato"}), 404

@app.route('/api/voti', methods=['GET'])
def get_voti():
    id_studente = request.args.get('id_studente')
    if id_studente:
        sql = "SELECT id_voto, valore, data, tipo_verifica, nota, id_studente, id_insegnamento FROM voti WHERE id_studente = %s ORDER BY data DESC"
        return jsonify(query_to_json(sql, (id_studente,)))
    return jsonify([])

@app.route('/api/assenze', methods=['GET'])
def get_assenze():
    id_studente = request.args.get('id_studente')
    if id_studente:
        sql = "SELECT id_assenza, data, tipo, giustificata, nota, id_studente FROM assenze WHERE id_studente = %s ORDER BY data DESC"
        return jsonify(query_to_json(sql, (id_studente,)))
    return jsonify([])

@app.route('/api/voti', methods=['POST'])
def aggiungi_voto():
    data_json = request.get_json()
    valore = data_json.get('valore')
    data_voto = data_json.get('data')
    tipo_verifica = data_json.get('tipo_verifica')
    nota = data_json.get('nota', None)
    id_studente = data_json.get('id_studente')
    id_insegnamento = data_json.get('id_insegnamento')

    if not all([valore, data_voto, tipo_verifica, id_studente, id_insegnamento]):
        return jsonify({"error": "Campi obbligatori mancanti"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        sql = """
        INSERT INTO voti (valore, data, tipo_verifica, nota, id_studente, id_insegnamento)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (valore, data_voto, tipo_verifica, nota, id_studente, id_insegnamento))
        conn.commit()
        return jsonify({"message": "Voto inserito con successo!", "id_voto": cursor.lastrowid}), 201
    except Exception as e:
        print(f"Errore inserimento voto: {e}")
        return jsonify({"error": "Errore interno del database"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/studenti/cerca', methods=['GET'])
def cerca_studenti():
    query = request.args.get('query', '')
    if not query:
        return jsonify([])
    sql = """
    SELECT id_studente, cognome, nome, codice_fiscale, data_nascita, id_classe
    FROM studenti WHERE cognome LIKE %s OR nome LIKE %s
    """
    like_query = f"%{query}%"
    return jsonify(query_to_json(sql, (like_query, like_query)))



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    