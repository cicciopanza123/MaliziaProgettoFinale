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
