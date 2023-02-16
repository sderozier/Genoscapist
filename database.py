#
#     name : database.py
#
#     Copyright (C) 2020  Sandra Dérozier (INRAE)
#
#     This program is free software; you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation; either version 2 of the License, or
#     (at your option) any later version.
#
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with this program; see the file COPYING . If not, write to the
#     Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
#
#     Please send bugreports with examples or suggestions to
#     sandra.derozier@inrae.fr

from flask import g, jsonify
import psycopg2
from psycopg2 import pool
import json
from genoscapist.config import *
from genoscapist.shared import *

# DB connexion
# def connect_db(app):
#     conn = None
#     conn = psycopg2.connect(
#         user = DB_USER,
#         password = DB_PWD,
#         host = DB_HOST,
#         port = DB_PORT,
#         database = DB_NAME
#     )
#
#     return conn

# DB pool connexion
def get_db(app):
    if 'db' not in g:
        g.db = app.config['postgreSQL_pool'].getconn()
    return g.db

# Features order
def get_list_features(app, conn):

    print("GET LIST FEATURES")
    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT type, position FROM bacteries.features_manager ORDER BY position")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()
        list_features = {}
        for type in result:
            list_features[type[0]] = type[1];

        return(list_features)

# Genomic sequence
def get_sequence(app, conn, specie):

    print("GET SEQUENCE")
    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT length FROM bacteries.sequences where accession = '" + specie + "'")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchone()
        cursor.close()

        return(result[0])

# All genes for the first table (index page)
def get_genes_list(app, conn):

    print("GET GENES LIST")
    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.id_feat, f.start, f.stop, f.complement, f.clustera, f.clusterb, f.clusterc, q.value \
            FROM bacteries.features f, bacteries.qualifiers q \
            WHERE f.id = q.feature_id AND f.type in ('CDS','TSV') AND q.type = 'name' \
            ORDER BY f.start \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_genes = []
        for line in result:

            gene = Gene(line[0], line[8], line[1], line[2], line[3], line[4],
                         line[5], line[6], line[7],
                         0, 0, 0, 0,
                         0, 0, 0, 0)

            list_genes.append(gene)

        return(list_genes)

# All deletions for the first table (index page)
def get_deletions_list(app, conn):

    print("GET DELETIONS LIST")
    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            # cursor.execute("\
            # SELECT f.id, f.id_feat, f.start, f.stop, f.complement, f.type \
            # FROM bacteries.features f \
            # WHERE f.type in ('left scar', 'right scar', 'cassette', 'hole') \
            # ORDER BY f.start \
            # ")
            cursor.execute("\
            SELECT DISTINCT ON (comments, start, type) id, comments, start, stop, complement, type \
            FROM bacteries.features \
            WHERE type in ('left scar', 'right scar', 'cassette', 'hole') \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_del = []
        for line in result:
            type = line[5]
            if line[5] == "hole":
                type = "deletion"
            deletion = Deletion(line[0], line[1], line[2], line[3], line[4], type)
            list_del.append(deletion)

        return(list_del)

# All genes
def get_identifiers_list(app, conn):

    print("GET IDENTIFIERS LIST")
    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id_feat, q.value \
            FROM bacteries.features f, bacteries.qualifiers q \
            WHERE f.id = q.feature_id AND f.type in ('CDS','TSV') AND q.type = 'name' \
            ORDER BY f.id_feat, q.value \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_identifiers = []
        for line in result:
            list_identifiers.append(line[0])
            list_identifiers.append(line[1])

        return(list_identifiers)

# All deletions
def get_deletion_identifiers_list(app, conn):

    print("GET DELETION IDENTIFIERS LIST")
    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id_feat \
            FROM bacteries.features f \
            WHERE f.type in ('left scar', 'right scar', 'cassette', 'hole') \
            ORDER BY f.id_feat \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_del_identifiers = []
        for line in result:
            list_del_identifiers.append(line[0])

        return(list_del_identifiers)

# All clusters
def get_clusters_list(app, conn):

    print("GET CLUSTERS LIST")
    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT name \
            FROM bacteries.cluster \
            ORDER BY name \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_clusters = []
        for line in result:
            list_clusters.append(line[0])

        return(list_clusters)

# All genes with cluster for the first table (index page)
def get_genes_with_cluster(app, cluster, conn):

    print("GET GENES WITH CLUSTER")
    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT DISTINCT f.id, f.id_feat, f.start, f.stop, f.complement, f.clustera, f.clusterb, f.clusterc, q.value \
            FROM bacteries.cluster c, bacteries.features f, bacteries.feat_cluster fc, bacteries.qualifiers q \
        	WHERE f.id = fc.feature_id AND fc.cluster_id = c.id AND f.id = q.feature_id \
            AND c.name = '" + cluster + "' AND q.type = 'name' ORDER BY f.start \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_genes = []
        for line in result:

            gene = Gene(line[0], line[8], line[1], line[2], line[3], line[4],
                         line[5], line[6], line[7],
                         0, 0, 0, 0,
                         0, 0, 0, 0)

            list_genes.append(gene)

        return(list_genes)

# All genes with position for the first table (index page)
def get_genes_with_position(app, position, conn):

    print("GET GENES WITH POSITION")
    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.id_feat, f.start, f.stop, f.complement, f.clustera, f.clusterb, f.clusterc, q.value \
            FROM bacteries.features f, bacteries.qualifiers q \
            WHERE (f.id_feat IN (SELECT id_feat FROM \
        	bacteries.features WHERE type IN ('CDS', 'TSV') AND start > " + position + " ORDER BY stop limit 1) \
        	OR f.id_feat IN (SELECT id_feat FROM  \
        	bacteries.features WHERE type IN ('CDS', 'TSV') AND start <= " + position + "AND stop >= " + position + ") \
        	OR f.id_feat IN" + " (SELECT id_feat FROM \
        	bacteries.features WHERE type IN ('CDS', 'TSV') AND stop < " + position + " ORDER BY stop DESC limit 1)) \
        	AND f.id = q.feature_id" + " AND q.type = 'name'" + " ORDER BY f.start \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_genes = []
        for line in result:

            gene = Gene(line[0], line[8], line[1], line[2], line[3], line[4],
                         line[5], line[6], line[7],
                         0, 0, 0, 0,
                         0, 0, 0, 0)

            list_genes.append(gene)

        return(list_genes)

# Gene with ID
def get_gene(app, name, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.id_feat, f.start, f.stop, f.complement, f.clustera, f.clusterb, f.clusterc, q.value \
        	FROM bacteries.features f, bacteries.qualifiers q \
            WHERE f.id = q.feature_id \
            AND (q.value ='" + name + "' OR f.id_feat ='" + name + "') \
            AND f.type in ('CDS','TSV') AND q.type = 'name' \
        	ORDER BY f.start \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchone()
        cursor.close()

        gene = {}
        gene["id"] = result[0]
        gene["name"] = result[8]
        gene["locustag"] = result[1]
        gene["start"] = result[2]
        gene["stop"] = result[3]
        gene["strand"] = result[4]
        gene["clustera"] = result[5]
        gene["clusterb"] = result[6]
        gene["clusterc"] = result[7]

        return(gene)

# GenBank annotation
def get_genbank_info(app, locus, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT q.type, q.value \
            FROM bacteries.features f, bacteries.qualifiers q \
        	WHERE f.id = q.feature_id \
            AND f.id_feat = '" + locus + "' \
        	AND q.type != 'name' AND q.type != 'Seed Annotation' \
            ORDER BY q.type \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_genbank = {}
        for line in result:
            list_genbank[line[0]] = line[1]

        return(list_genbank)

# Additional informations
def get_add_info(app, locus, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT q.type, q.value \
            FROM bacteries.features f, bacteries.qualifiers q \
        	WHERE f.id = q.feature_id \
            AND f.id_feat = '" + locus + "' \
        	AND q.type = 'Seed Annotation' \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_info = {}
        for line in result:
            list_info[line[0]] = line[1]

        return(list_info)

# Expression Conditions
def get_exp_conditions(app, locus, level, conn):

    conn = get_db(app)
    if conn != None:
        order = "DESC"
        if level == -1:
            order = ""

        cursor = conn.cursor()
        command = "SELECT c.name, fc.value \
        FROM bacteries.feat_condition fc, bacteries.condition c, bacteries.features f \
        WHERE f.id = fc.feature_id and c.id = fc.condition_id \
    	AND f.id_feat = '" + locus + "' \
        AND fc.expression = " + str(level) + " \
        ORDER BY fc.value " + order;
        try:
            cursor.execute(command)
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_all = {}
        list_name = []
        list_val = []
        for line in result:
            list_name.append(line[0])
            list_val.append(line[1])

        list_all["name"] = list_name
        list_all["value"] = list_val

        return(list_all)

# Correlated Segments
def get_correl_segments(app, locus, level, conn):

    conn = get_db(app)
    if conn != None:
        order = "DESC"
        if level == -1:
            order = ""

        cursor = conn.cursor()
        command = "SELECT s.name, fs.value \
        FROM bacteries.feat_segment fs, bacteries.segment s, bacteries.features f \
        WHERE f.id = fs.feature_id and s.id = fs.segment_id \
    	AND f.id_feat = '" + locus + "' \
        AND fs.correlation = " + str(level) + " \
        ORDER BY fs.value " + order;
        try:
            cursor.execute(command)
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_all = {}
        list_name = []
        list_val = []
        for line in result:
            list_name.append(line[0])
            list_val.append(line[1])

        list_all["name"] = list_name
        list_all["value"] = list_val

        return(list_all)

# TranstermHP
def get_list_transterms(app, seq, f, to, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color, q.value \
            FROM bacteries.features f, bacteries.sequences s, bacteries.qualifiers q \
            WHERE s.name = '" + seq + "' AND f.sequence_id = s.id AND f.id = q.feature_id \
        	AND f.type = 'transtermHP' AND q.type = 'thickness' \
            AND f.stop >= " + str(f) + " AND f.start <= " + str(to) + " \
            ORDER BY f.ID, f.START \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_transterm = {}
        i = 0
        for line in result:
            i = i + 1
            transterm = {}
            transterm["id"] = line[0]
            transterm["start"] = line[1]
            transterm["stop"] = line[2]
            transterm["complement"] = line[3]
            transterm["name"] = line[4]
            transterm["color"] = line[5]
            transterm["thickness"] = line[6]
            list_transterm["transterm_"+str(i)] = transterm

        return(list_transterm)

# CDS
def get_list_cds(app, seq, f, to, type, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color, f.location, f.type \
            FROM bacteries.features f, bacteries.sequences s \
            WHERE s.name = '" + seq + "' AND f.sequence_id = s.id \
            AND type = '" + type + "'" + " AND stop >= " + str(f) + " \
            AND f.id_feat not like '%CDS_TEST%' \
        	AND start <= " + str(to) + " ORDER BY f.id, f.start\
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_cds = {}
        i = 0
        for line in result:
            i = i + 1
            cds = {}
            cds["id"] = line[0]
            cds["start"] = line[1]
            cds["stop"] = line[2]
            cds["complement"] = line[3]
            cds["name"] = line[4]
            cds["color"] = line[5]
            cds["location"] = line[6]
            cds["type"] = line[7]
            list_cds["cds_"+str(i)] = cds

        return(list_cds)

# Beaume segments
def get_list_beaume(app, seq, f, to, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color \
            FROM bacteries.features f, bacteries.sequences s \
            WHERE s.name = '" + seq + "' AND f.sequence_id = s.id \
            AND f.type = 'Regulator' \
            AND f.stop >= " + str(f) + " AND f.start <= " + str(to) + " \
            ORDER BY f.id, f.start \
            ")
        except Exception as err:
            print_psycopg2_exception(err)

        result = cursor.fetchall()

        list_beaume = {}
        i = 0
        for line in result:
            try:
                cursor.execute("SELECT type, value \
                FROM bacteries.qualifiers \
                WHERE feature_id = " + str(line[0]) + \
                "ORDER BY type")
            except Exception as err:
                print_psycopg2_exception(err)
            result2 = cursor.fetchall()

            i = i + 1
            beaume = {}
            beaume["id"] = line[0]
            beaume["start"] = line[1]
            beaume["stop"] = line[2]
            beaume["complement"] = line[3]
            beaume["name"] = line[4]
            beaume["color"] = line[5]
            beaume["filled"] = result2[0][1]
            beaume["thickness"] = result2[1][1]
            list_beaume["beaume_"+str(i)] = beaume

        cursor.close()
        return(list_beaume)

# Segments
def get_list_segments(app, seq, f, to, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color, q.value \
            FROM bacteries.features f, bacteries.sequences s, bacteries.qualifiers q \
            WHERE s.name = '" + seq + "' AND f.sequence_id = s.id AND f.id = q.feature_id \
            AND f.type = 'segment' AND q.type = 'filled' \
            AND f.stop >= " + str(f) + " AND f.start <= " + str(to) + " \
            ORDER BY f.id, f.start \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_seg = {}
        i = 0
        for line in result:
            i = i + 1
            segment = {}
            segment["id"] = line[0]
            segment["start"] = line[1]
            segment["stop"] = line[2]
            segment["complement"] = line[3]
            segment["name"] = line[4]
            segment["color"] = line[5]
            segment["filled"] = line[6]
            list_seg["segment_"+str(i)] = segment

        return(list_seg)

# Hole / Cassette / %Scar
def get_list_typeRegions(app, seq, f, to, conn, type):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            if type == 'cassette':
                cursor.execute("\
                SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color, f.type, q.value \
                FROM bacteries.features f, bacteries.sequences s, bacteries.qualifiers q \
                WHERE s.name = '" + seq + "' AND f.sequence_id = s.id \
                AND f.id = q.feature_id \
                AND q.type = 'size' \
                AND f.type = '" + type + "' \
                AND f.stop >= " + str(f) + " AND f.start <= " + str(to) + " \
                ORDER BY f.id, f.start \
                ")
            else:
                cursor.execute("\
                SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color, f.type, f.comments \
                FROM bacteries.features f, bacteries.sequences s \
                WHERE s.name = '" + seq + "' AND f.sequence_id = s.id \
                AND f.type = '" + type + "' \
                AND f.stop >= " + str(f) + " AND f.start <= " + str(to) + " \
                ORDER BY f.id, f.start \
                ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_regions = {}
        i = 0
        for line in result:
            i = i + 1
            region = {}
            region["id"] = line[0]
            region["start"] = line[1]
            region["stop"] = line[2]
            region["complement"] = line[3]
            region["name"] = line[4]
            region["color"] = line[5]
            region["type"] = line[6]
            region["comments"] = line[7]
            list_regions[type+"_"+str(i)] = region

        return(list_regions)
# deletedRegions
def get_list_deletedRegions(app, seq, f, to, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color \
            FROM bacteries.features f, bacteries.sequences s \
            WHERE s.name = '" + seq + "' AND f.sequence_id = s.id \
            AND f.type = 'DeletedRegion' \
            AND f.stop >= " + str(f) + " AND f.start <= " + str(to) + " \
            ORDER BY f.id, f.start \
            ")
        except Exception as err:
            print_psycopg2_exception(err)

        result = cursor.fetchall()
        cursor.close()

        list_regions = {}
        i = 0
        for line in result:
            i = i + 1
            region = {}
            region["id"] = line[0]
            region["start"] = line[1]
            region["stop"] = line[2]
            region["complement"] = line[3]
            region["name"] = line[4]
            region["color"] = line[5]
            list_regions["deletedRegions_"+str(i)] = region

        return(list_regions)

# Transcription units
def get_list_promotors(app, seq, f, to, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color, q.value \
            FROM bacteries.features f, bacteries.sequences s, bacteries.qualifiers q \
            WHERE s.name = '" + seq + "'" + " AND f.sequence_id = s.id AND f.id = q.feature_id \
        	AND f.type = 'promoter' AND q.type = 'center' \
            AND f.stop >= " + str(f) + " AND f.start <= " + str(to) + " \
            ORDER BY f.ID, f.START \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_prom = {}
        i = 0
        for line in result:
            i = i + 1
            promotor = {}
            promotor["id"] = line[0]
            promotor["start"] = line[1]
            promotor["stop"] = line[2]
            promotor["complement"] = line[3]
            promotor["name"] = line[4]
            promotor["color"] = line[5]
            promotor["center"] = line[6]
            list_prom["promotor_"+str(i)] = promotor

        return(list_prom)
def get_list_terminators(app, seq, f, to, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color, q.value \
            FROM bacteries.features f, bacteries.sequences s, bacteries.qualifiers q \
            WHERE s.name = '" + seq + "'" + " AND f.sequence_id = s.id AND f.id = q.feature_id \
        	AND f.type = 'terminator' AND q.type = 'center' \
            AND f.stop >= " + str(f) + " AND f.start <= " + str(to) + " \
            ORDER BY f.ID, f.START \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_term = {}
        i = 0
        for line in result:
            i = i + 1
            terminator = {}
            terminator["id"] = line[0]
            terminator["start"] = line[1]
            terminator["stop"] = line[2]
            terminator["complement"] = line[3]
            terminator["name"] = line[4]
            terminator["color"] = line[5]
            terminator["center"] = line[6]
            list_term["terminator_"+str(i)] = terminator

        return(list_term)
def get_list_lines(app, seq, f, to, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT a.id, a.complement, a.color, a.x1, a.y1, a.x2, a.y2 \
            FROM bacteries.axis a, bacteries.sequences s \
            WHERE s.id = a.sequence_id \
            AND s.name = '" + seq + "' \
        	AND x1 <= " + str(to) + " AND x2 >= " + str(f) + " \
            ORDER BY x1 \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_lines = {}
        i = 0
        for line in result:
            i = i + 1
            lines = {}
            lines["id"] = line[0]
            lines["complement"] = line[1]
            lines["color"] = line[2]
            lines["x1"] = line[3]
            lines["y1"] = line[4]
            lines["x2"] = line[5]
            lines["y2"] = line[6]
            list_lines["lines_"+str(i)] = lines

        return(list_lines)

# Sample groups (for selection)
def get_list_samples(app, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT es.id, es.sequence_id, es.chip_id, es.experience, es.project, es.normalization, es.strand, es.color, es.info, \
            es.number, es.replicate, \
            eg.description, eg.name, es.rcolor \
            FROM bacteries.exp_seq es, bacteries.exp_group eg \
            WHERE es.exp_group_id = eg.id AND es.strand = 1 \
            AND es.normalization = 'CustomCDS' \
        	AND es.project != 'Rho' \
            ORDER BY upper(es.experience) \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_exp = []
        i = 0
        for line in result:
            i = i + 1
            exp = {}
            exp["id"] = line[0]
            exp["seq_id"] = line[1]
            exp["chip_id"] = line[2]
            exp["name"] = line[3]
            exp["project"] = line[4]
            exp["norm"] = line[5]
            exp["strand"] = line[6]
            exp["color"] = line[7]
            exp["info"] = line[8]
            exp["number"] = line[9]
            exp["replicate"] = line[10]
            exp["desc"] = line[11]
            exp["group_name"] = line[12]
            exp["rcolor"] = line[13]
            exp["checked"] = line[8]
            exp["new_color"] = line[7] # ''
            #list_exp["exp_"+str(i)] = exp
            list_exp.append(exp)

        return(list_exp)
def get_list_groups(app, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT es.id, es.sequence_id, es.chip_id, es.experience, es.project, es.normalization, es.strand, es.color, es.info, \
            es.number, es.replicate, \
            eg.description, eg.name, es.rcolor \
            FROM bacteries.exp_seq es, bacteries.exp_group eg \
            WHERE es.exp_group_id = eg.id AND es.strand = 1 \
            AND es.normalization = 'CustomCDS' \
        	AND es.project != 'Rho' \
            ORDER BY upper(eg.name), es.number \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_exp = {}

        for line in result:

            exp = {}
            exp["id"] = line[0]
            exp["seq_id"] = line[1]
            exp["chip_id"] = line[2]
            exp["name"] = line[3]
            exp["project"] = line[4]
            exp["norm"] = line[5]
            exp["strand"] = line[6]
            exp["color"] = line[7]
            exp["new_color"] = line[7]
            exp["info"] = line[8]
            exp["number"] = line[9]
            exp["replicate"] = line[10]
            exp["desc"] = line[11]
            exp["group_name"] = line[12]
            exp["rcolor"] = line[13]
            exp["checked"] = line[8]

            if line[12] in list_exp:
                list_exp[line[12]][line[3]] = exp;
            else:
                list_exp[line[12]] = {};
                list_exp[line[12]][line[3]] = exp;

        return(list_exp)
def get_rho_description(app, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute(" \
            SELECT distinct eg.description \
            FROM bacteries.exp_seq es, bacteries.exp_group eg \
            WHERE es.exp_group_id = eg.id \
            AND es.project = 'Rho' \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchone()
        cursor.close()

        return(result[0])

# Sample (Reannotation)
def get_list_all_exp(app, seq, norm, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT es.id, es.sequence_id, es.chip_id, es.experience, es.project, es.normalization, es.strand, es.color, es.info, \
            es.number, es.replicate, \
            eg.description, eg.name, es.rcolor \
            FROM bacteries.exp_seq es, bacteries.exp_group eg \
            WHERE es.exp_group_id = eg.id AND es.strand = 1 \
            AND es.normalization = '" + norm + "' \
        	AND es.project != 'Rho' \
            ORDER BY upper(es.experience) \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_exp = []
        i = 0
        for line in result:
            i = i + 1
            exp = {}
            exp["id"] = line[0]
            exp["seq_id"] = line[1]
            exp["chip_id"] = line[2]
            exp["name"] = line[3]
            exp["project"] = line[4]
            exp["norm"] = line[5]
            exp["strand"] = line[6]
            exp["color"] = line[7]
            exp["info"] = line[8]
            exp["number"] = line[9]
            exp["replicate"] = line[10]
            exp["desc"] = line[11]
            exp["group_name"] = line[12]
            exp["rcolor"] = line[13]
            exp["new_color"] = line[7]
            exp["checked"] = line[8]
            list_exp.append(exp)

        return(list_exp)
def get_list_default_exp(app, seq, norm, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT es.id, es.sequence_id, es.chip_id, es.experience, es.project, es.normalization, es.strand, es.color, \
            es.number, es.replicate, \
            eg.description, eg.name, es.info, es.rcolor \
            FROM bacteries.exp_seq es, bacteries.exp_group eg \
            WHERE es.exp_group_id = eg.id AND es.info = 1 AND es.normalization = '" + norm + "' \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_exp = {}
        i = 0
        for line in result:
            i = i + 1
            exp = {}
            exp["id"] = line[0]
            exp["seq_id"] = line[1]
            exp["chip_id"] = line[2]
            exp["name"] = line[3]
            exp["project"] = line[4]
            exp["norm"] = line[5]
            exp["strand"] = line[6]
            exp["color"] = line[7]
            exp["new_color"] = line[7] # null
            exp["number"] = line[8]
            exp["replicate"] = line[9]
            exp["desc"] = line[10]
            exp["group_name"] = line[11]
            exp["info"] = line[12]
            exp["checked"] = line[12]
            exp["rcolor"] = line[13]
            list_exp["exp_"+str(i)] = exp

        return(list_exp)
def get_list_selected_exp(app, seq, norm, txt_list, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        command = "SELECT es.id, es.sequence_id, es.chip_id, es.experience, es.project, \
        es.normalization, es.strand, es.color, es.number, es.replicate, \
        expg.description, expg.name, es.info, es.rcolor \
        FROM bacteries.exp_seq es, bacteries.exp_group expg \
        WHERE es.exp_group_id = expg.id AND es.normalization = '" + norm + "' \
        AND es.experience in " + txt_list
        try:
            cursor.execute(command)
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_exp = {}
        i = 0
        for line in result:
            i = i + 1
            exp = {}
            exp["id"] = line[0]
            exp["seq_id"] = line[1]
            exp["chip_id"] = line[2]
            exp["name"] = line[3]
            exp["project"] = line[4]
            exp["norm"] = line[5]
            exp["strand"] = line[6]
            exp["color"] = line[7]
            exp["new_color"] = line[7] # null
            exp["number"] = line[8]
            exp["replicate"] = line[9]
            exp["desc"] = line[10]
            exp["group_name"] = line[11]
            exp["info"] = line[12]
            exp["checked"] = line[12]
            exp["rcolor"] = line[13]
            list_exp["exp_"+str(i)] = exp

        return(list_exp)

# Sample data
def get_list_expression(app, seq, f, to, exp_id, seq_size, conn):

    conn = get_db(app)
    if conn != None:
        if f > 100:
            f -= 100
        else:
            f = 1
        if to <= (seq_size - 100):
            to += 100
        else:
            to = seq_size

        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT position, signal \
            FROM bacteries.expression \
            WHERE exp_seq_id = " + str(exp_id) + " \
            AND position >= " + str(f) + " AND position <= " + str(to) + " \
            ORDER BY position \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_expr = {}
        i = 0
        for line in result:
            i = i + 1
            expr = {}
            expr["position"] = line[0]
            expr["signal"] = line[1]
            list_expr[expr["position"]] = expr

        return(list_expr)

# Sample (Rho)
def get_list_rho_exp(app, seq, norm, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("\
            SELECT es.id, es.sequence_id, es.chip_id, es.experience, es.project, es.normalization, es.strand, es.color \
            FROM bacteries.exp_seq es \
            WHERE es.project = 'Rho' AND es.normalization = '" + norm + "' \
            ORDER BY es.experience ASC, es.strand DESC \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_rho = {}
        i = 0
        for line in result:
            i = i + 1
            rho = {}
            rho["id"] = line[0]
            rho["seq_id"] = line[1]
            rho["chip_id"] = line[2]
            rho["name"] = line[3]
            rho["project"] = line[4]
            rho["norm"] = line[5]
            rho["strand"] = line[6]
            rho["color"] = line[7]
            list_rho["rho_"+str(i)] = rho

        return(list_rho)
def get_list_rho_groups(app, norm, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute(" \
            SELECT es.id, es.sequence_id, es.chip_id, es.experience, es.project, es.normalization, es.strand, es.color, es.info, \
            es.number, es.replicate, \
            eg.description, eg.name \
            FROM bacteries.exp_seq es, bacteries.exp_group eg \
            WHERE es.exp_group_id = eg.id \
            AND es.normalization = '"+norm+"' \
            AND es.project = 'Rho' \
            ORDER BY upper(eg.name), es.number \
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_exp = {}

        for line in result:

            exp = {}
            exp["id"] = line[0]
            exp["seq_id"] = line[1]
            exp["chip_id"] = line[2]
            exp["name"] = line[3]
            exp["project"] = line[4]
            exp["norm"] = line[5]
            exp["strand"] = line[6]
            exp["color"] = line[7]
            exp["info"] = line[8]
            exp["number"] = line[9]
            exp["replicate"] = line[10]
            exp["desc"] = line[11]
            exp["group_name"] = line[12]
            exp["checked"] = line[8]
            tmp = line[3] + "_" + str(line[6])

            if line[12] in list_exp:
                list_exp[line[12]][tmp] = exp;
            else:
                list_exp[line[12]] = {};
                list_exp[line[12]][tmp] = exp;

        return(list_exp)
def get_list_rho_region(app, seq, f, to, type, group, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT f.id, f.start, f.stop, f.complement, f.id_feat, f.color, f.location, f.type \
            FROM bacteries.features f, bacteries.sequences s \
            WHERE s.name = '" + seq + "' AND f.sequence_id = s.id \
            AND type = '" + type + "'" + " AND stop >= " + str(f) + " \
            AND f.id_feat like '%" + group + "%' \
            AND start <= " + str(to) + " ORDER BY f.id, f.start\
            ")
        except Exception as err:
            print_psycopg2_exception(err)
        segments = cursor.fetchall()
        cursor.close()

        list_segments = {}
        for segment in segments:
            seg = {}
            seg["id"] = segment[0]
            seg["start"] = segment[1]
            seg["stop"] = segment[2]
            seg["complement"] = segment[3]
            seg["name"] = segment[4]
            seg["color"] = segment[5]
            seg["location"] = segment[6]
            seg["type"] = segment[7]

            list_segments[segment[4]] = seg;

        return list_segments

# Regions without data
def get_list_region(app, seq, f, to, conn):

    conn = get_db(app)
    if conn != None:
        cursor = conn.cursor()
        command = "SELECT f.id, f.start, f.stop, f.complement, f.id_feat \
        FROM bacteries.features f, bacteries.sequences s \
        WHERE s.name = '" + seq + "'" + " AND f.sequence_id = s.id \
    	AND f.type = 'blank' \
        AND f.stop >= " + str(f) + " AND f.start <= " + str(to) + " \
    	ORDER BY f.id, f.start"
        try:
            cursor.execute(command)
        except Exception as err:
            print_psycopg2_exception(err)
        result = cursor.fetchall()
        cursor.close()

        list_blank = {}
        i = 0
        for line in result:
            i = i + 1
            blank = {}
            blank["id"] = line[0]
            blank["start"] = line[1]
            blank["stop"] = line[2]
            blank["complement"] = line[3]
            blank["name"] = line[4]
            list_blank["blank"+str(i)] = blank

        return(list_blank)
