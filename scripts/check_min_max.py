#
#     name : check_min_max.py
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

# Parameters
dbname = 'seb_demo'                         # Database name
dbuser = 'admin_user'                       # Database user name
dbpasswd = 'sebadmin2020'                   # Database password
dbhost = 'localhost'                        # Database host
dbport = 5433                               # Database port
accession = "AL009126"
normalization = ["CustomCDS", "Median"]

# Database connection
def connect_db():
    conn = psycopg2.connect(dbname=dbname, user=dbuser, password=dbpasswd, host=dbhost, port=dbport)
    return conn

# Sequence ID
def get_sequence(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM bacteries.sequences WHERE accession = '"+accession+"'")
    sequence_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    return sequence_id

def get_max(value):
    decimal2 = str(value).split('.')[1][1]
    if int(decimal2) <= 5:
        final_val = round(value+0.1,1)
    else:
        final_val = round(value,1)
    return final_val

def get_min(value):
    decimal2 = str(value).split('.')[1][1]
    if int(decimal2) >= 5:
        if str(value).split('.')[0].startswith("-"):
            final_val = round(value+0.1,1)
        else:
            final_val = round(value-0.1,1)
    else:
        final_val = round(value,1)
    return final_val

def get_threshold(conn, norm, type, seq_id):
    cursor = conn.cursor()
    if type == "min":
        query = "SELECT min(exp.signal) FROM bacteries.expression exp, bacteries.exp_seq seq \
                 WHERE exp.exp_seq_id = seq.id AND seq.normalization = '"+norm+"' \
                 AND seq.sequence_id = '" + str(seq_id) + "'"
    else:
        query = "SELECT max(exp.signal) FROM bacteries.expression exp, bacteries.exp_seq seq \
                 WHERE exp.exp_seq_id = seq.id AND seq.normalization = '"+norm+"' \
                 AND seq.sequence_id = '" + str(seq_id) + "'"
    cursor.execute(query)
    threshold = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    return threshold

def main():
    conn = connect_db()
    sequence_id = get_sequence(conn)
    with open("Config_Thresholds.txt", "w") as output:
        for norm in normalization:
            threshold = get_min(get_threshold(conn, norm, "min", sequence_id))
            if norm == "CustomCDS":
                output.write("MIN_CUSTOM="+str(threshold) + "\n")
                print("MIN_CUSTOM="+str(threshold))
            else:
                output.write("MIN_MEDIAN="+str(threshold) + "\n")
                print("MIN_MEDIAN="+str(threshold))
            threshold = get_max(get_threshold(conn, norm, "max", sequence_id))
            if norm == "CustomCDS":
                output.write("MAX_CUSTOM="+str(threshold) + "\n")
                print("MAX_CUSTOM="+str(threshold))
            else:
                output.write("MAX_MEDIAN="+str(threshold) + "\n")
                print("MAX_MEDIAN="+str(threshold))

if __name__ == "__main__":
    main()
