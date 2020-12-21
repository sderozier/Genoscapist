#
#     name : add_annotation_gb.py
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

# Libraries
import psycopg2
from datetime import date
from Bio import SeqIO
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord

# Parameters
gb_file = "./data/AL009126_light.gb"     # GenBank file with annotation
dbname = 'seb_demo'                      # Database name
dbuser = 'admin_user'                    # Database user name
dbpasswd = 'sebadmin2020'                # Database password
dbhost = 'localhost'                     # Database host
dbport = 5433                            # Database port
today = date.today()

# Database connection
def connect_db():
    conn = psycopg2.connect(dbname=dbname, user=dbuser, password=dbpasswd, host=dbhost, port=dbport)
    return conn

# Species table
def insert_specie(conn, accession):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bacteries.species (name) VALUES ('"+accession+"')")
    cursor.execute("SELECT id FROM bacteries.species WHERE name = '"+accession+"'")
    specie_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    return specie_id

# Sequences table
def insert_sequence(conn, accession, length, id, source):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bacteries.sequences \
                    (accession, name, species_id, length, date, definition, source) \
                    VALUES ('"+accession+"', '"+accession+"', "+str(id)+", "+str(length)+", \
                    '"+ today.strftime("%Y/%m/%d")+"', '"+accession+"', '"+source+"')")
    cursor.execute("SELECT id FROM bacteries.sequences WHERE accession = '"+accession+"'")
    sequence_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    return sequence_id

# Locations table
def insert_location(conn, feat_id, location):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bacteries.locations (feature_id, start, stop, complement) \
                    VALUES ("+str(feat_id)+", "+str(location.start+1)+", "+str(location.end)+ \
                    ", '"+str(location.strand)+"')")
    conn.commit()
    cursor.close()

# Features table (type = CDS)
def insert_feature(conn, seq_id, type, location, locus):
    cursor = conn.cursor()
    loc = str(location.start+1)+".."+str(location.end)
    if location.strand == '-1':
        loc = "complement("+loc+")"
    cursor.execute("INSERT INTO bacteries.features \
                    (sequence_id, type, location, complement, comments, start, stop, id_feat) \
                    VALUES ("+str(seq_id)+", '"+type+"', '"+loc+"', '"+str(location.strand)+"', \
                    'GENBANK', "+str(location.start+1)+" , "+str(location.end)+", '"+locus+"')")
    cursor.execute("SELECT id FROM bacteries.features WHERE id_feat = '"+locus+"'")
    feature_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    insert_location(conn, feature_id, location)
    return feature_id

# Qualifiers table
def insert_qualifier(conn, feat_id, type, value):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bacteries.qualifiers (feature_id, type, value) \
                    VALUES ("+str(feat_id)+", '"+type+"', '"+value+"')")
    conn.commit()
    cursor.close()

# GenBank file reading
def main():
    conn = connect_db()
    for record in SeqIO.parse(gb_file, "genbank"):
        specie_id = insert_specie(conn, record.name)
        sequence_id = insert_sequence(conn, record.name, len(record.seq), specie_id, "GENBANK")
        for feature in record.features:
            if feature.type == 'CDS':
                feature_id = insert_feature(conn, sequence_id, "CDS", feature.location, feature.qualifiers['locus_tag'][0])
                insert_qualifier(conn, feature_id, 'name', str(feature.qualifiers['gene'][0]))
                for qualifier in feature.qualifiers:
                    if qualifier not in ('locus_tag', 'translation'):
                        insert_qualifier(conn, feature_id, qualifier, str(feature.qualifiers[qualifier][0]).replace("'", "''"))

if __name__ == "__main__":
    main()
