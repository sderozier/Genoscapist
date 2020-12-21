#
#     name : add_samples.py
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
import statistics
import sys

# Parameters
samples_file = "./data/samples.csv"         # CSV file with samples
groups_file = "./data/groups.tsv"           # TSV file with samples groups
customcds1 = "./data/CustomCDS_1.csv"       # CSV file with samples data CustomCDS norm strand +
customcds2 = "./data/CustomCDS_2.csv"       # CSV file with samples data CustomCDS norm strand -
median1 = "./data/Median_1.csv"             # CSV file with samples data Median norm strand +
median2 = "./data/Median_2.csv"             # CSV file with samples data Median norm strand -
nodata = "./data/BlankRegions.csv"          # CSV file with regions without data
rho_groups_file = "./data/rho_groups.tsv"   # TSV file with rho groups
rho_file = "./data/rho.csv"                 # CSV file with rho samples
rhocustomcds1 = "./data/RhoCustomCDS_1.csv" # CSV file with rho samples data CustomCDS norm strand +
rhocustomcds2 = "./data/RhoCustomCDS_2.csv" # CSV file with rho samples data CustomCDS norm strand -
rhomedian1 = "./data/RhoMedian_1.csv"       # CSV file with rho samples data Median norm strand +
rhomedian2 = "./data/RhoMedian_2.csv"       # CSV file with rho samples data Median norm strand -
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

# Exp_seq table
def insert_sample(conn, seq_id, chip_id, exp_name, proj_name, color, info):
    cursor = conn.cursor()
    for norm in normalization:
        for strand in ('1', '-1'):
            cursor.execute("INSERT INTO bacteries.exp_seq \
                            (sequence_id, chip_id, experience, project, normalization, strand, color, info) \
                            VALUES ("+str(seq_id)+", '"+str(chip_id)+"', '"+exp_name+"', '"+ \
                            proj_name+"', '" + norm+"', '"+str(strand)+"', '"+color+"', '"+str(info)+"')")
    conn.commit()
    cursor.close()
# CSV samples reading
def read_samples(conn, seq_id):

    with open(samples_file, "r") as samples:
        for sample in samples:
            if sample.startswith("chip") == False:
                elements = sample.strip().split(',')
                insert_sample(conn, seq_id, elements[0], elements[1], 'Reannotation', elements[2], elements[3])

# Exp_group table
def insert_group(conn, name, description, reference):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bacteries.exp_group (name, description, reference) \
                    VALUES ('" + name + "', '" + description + \
                    "','" + reference + "')")
    cursor.execute("SELECT id FROM bacteries.exp_group WHERE name = '"+name+"'")
    group_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    return group_id
# Exp_seq table (exp_group_id, number, replicat)
def insert_rep_sample(conn, group_id, elements):
    cursor = conn.cursor()
    cursor.execute("UPDATE bacteries.exp_seq SET exp_group_id = " + str(group_id) + \
                   " WHERE experience = '" +elements[3]+ "'")
    cursor.execute("UPDATE bacteries.exp_seq SET number = " + str(elements[0]) + \
                   " WHERE experience = '" +elements[3]+ "'")
    cursor.execute("UPDATE bacteries.exp_seq SET replicate = " + str(elements[6].replace('exp. N°', '')) + \
                   " WHERE experience = '" +elements[3]+ "'")
    conn.commit()
    cursor.close()
# TSV groups reading
def read_groups(conn):
    with open(groups_file, "r") as groups:
        for group in groups:
            if group.startswith("Chip") == False:
                elements = group.strip().split('\t')
                if elements[2] != '':
                    name = elements[2]
                    group_id = insert_group(conn, elements[2], elements[4].replace('"', '').replace("  ", " ").replace(" .", "."), elements[8])
                insert_rep_sample(conn, group_id, elements)

# Getting all groups
def get_groups(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM bacteries.exp_group")
    groups_id = cursor.fetchall()
    conn.commit()
    cursor.close()
    return groups_id
# Getting all replicats colors
def get_colors(conn, group_id):
    cursor = conn.cursor()
    cursor.execute("SELECT distinct color FROM bacteries.exp_seq WHERE exp_group_id = " + str(group_id))
    colors = cursor.fetchall()
    conn.commit()
    cursor.close()
    return colors
# Transforming HEX color to RGB
def hex_to_rgb(hex):
    hex = hex.lstrip('#')
    rgb = tuple(int(hex[i:i+2], 16) for i in (0, 2, 4))
    return rgb
# Exp_seq table (rcolor)
def insert_group_color(conn, group_id, rcolor):
    cursor = conn.cursor()
    cursor.execute("UPDATE bacteries.exp_seq \
                    SET rcolor = '"+rcolor+"' \
                    WHERE exp_group_id = " + str(group_id))
    conn.commit()
    cursor.close()
# Define a group color
def read_group_color(conn):
    groups = get_groups(conn)
    for group in groups:
        list_color = get_colors(conn, group[0])
        colors = []
        for color in list_color:
            colors.append(hex_to_rgb(color[0]))
        tmp = [int(statistics.mean(i)) for i in zip(*colors)]
        r_color = '#%02x%02x%02x' % tuple(tmp)
        insert_group_color(conn, group[0], r_color)

# Get samples id
def get_samples(conn, header, normalization, strand, project):
    cursor = conn.cursor()
    samples = header.strip().split(',')
    ids = []
    for sample in samples:
        if sample not in ('Pos', 'PosV3', 'CDS_Median', 'CDS_two_median', 'brown', 'white'):
            cursor.execute("SELECT id FROM bacteries.exp_seq \
                            WHERE experience = '"+sample+"' \
                            AND normalization = '"+normalization+"' \
                            AND project = '"+project+"' \
                            AND strand = "+str(strand))
            tmp = cursor.fetchone()
            ids.append(tmp[0])
    conn.commit()
    cursor.close()
    return ids
# Expression table
def insert_sample_data(conn, sample_id, position, signal):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bacteries.expression (exp_seq_id, position, signal) \
                    VALUES ("+str(sample_id)+", "+str(position)+", '"+str(signal)+"')")
    conn.commit()
    cursor.close()
# CSV samples data
def read_samples_data(conn, file, norm, strand, project):
    with open(file, "r") as infile:
        first_line = infile.readline()
        ids = get_samples(conn, first_line, norm, strand, project)
        for lines in infile:
            tmp = lines.strip().split(',')
            if norm == "CustomCDS":
                limit = len(tmp)-3
            else:
                limit = len(tmp)-4
            for i in range(1, limit):
                insert_sample_data(conn, ids[i-1], tmp[0], tmp[i])

# Locations table
def insert_location(conn, feat_id, start, stop, strand):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bacteries.locations (feature_id, start, stop, complement) \
                    VALUES ("+str(feat_id)+", "+str(start)+", "+str(stop)+ \
                    ", '"+str(strand)+"')")
    conn.commit()
    cursor.close()
# Features table (type = blank)
def insert_region_nodata(conn, seq_id, elements):
    cursor = conn.cursor()
    loc = str(elements[1])+".."+str(elements[2])
    if elements[0] == '-1':
        loc = "complement("+loc+")"
    name = 'blankregion_'+str(elements[1])+'_'+str(elements[0])
    cursor.execute("INSERT INTO bacteries.features \
                    (sequence_id, type, location, complement, start, stop, id_feat) \
                    VALUES ("+str(seq_id)+", 'blank', '"+loc+"', '"+str(elements[0])+ "', " + \
                    str(elements[1])+", "+str(elements[2])+", '"+name+"')")
    cursor.execute("SELECT id FROM bacteries.features WHERE id_feat = '"+name+"'")
    feature_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    insert_location(conn, feature_id, str(elements[1]), str(elements[2]), str(elements[0]))
# CSV no data regions
def read_nodata(conn, seq_id):
    with open(nodata, "r") as infile:
        header = infile.readline()
        for line in infile:
            elements = line.strip().split(",")
            insert_region_nodata(conn, seq_id, elements)

# Exp_seq table (exp_group_id for rho)
def insert_grpid_rho_sample(conn, group_id):
    cursor = conn.cursor()
    cursor.execute("UPDATE bacteries.exp_seq SET exp_group_id = " + str(group_id) + \
                   " WHERE project = 'Rho'")
    conn.commit()
    cursor.close()
# Read rho groups
def read_rho_groups(conn):
    with open(rho_groups_file, "r") as groups:
        for group in groups:
            if group.startswith("Group") == False:
                elements = group.strip().split('\t')
                group_id = insert_group(conn, elements[0], elements[1], '')
                insert_grpid_rho_sample(conn, group_id)
# CSV rho samples data
def read_rho_samples(conn, seq_id):
    with open(rho_file, "r") as samples:
        header = samples.readline()
        for sample in samples:
            elements = sample.strip().split(',')
            insert_sample(conn, seq_id, elements[0], elements[1], 'Rho', elements[3], 0)

def main():
    conn = connect_db()
    sequence_id = get_sequence(conn)
    # Reannotation samples data
    read_samples(conn, sequence_id)
    read_groups(conn)
    read_group_color(conn)
    read_samples_data(conn, customcds1, "CustomCDS", 1, 'Reannotation')
    read_samples_data(conn, customcds2, "CustomCDS", -1, 'Reannotation')
    read_samples_data(conn, median1, "Median", 1, 'Reannotation')
    read_samples_data(conn, median2, "Median", -1, 'Reannotation')
    read_nodata(conn, sequence_id)
    # Rho samples data
    read_rho_samples(conn, sequence_id)
    read_rho_groups(conn)
    read_samples_data(conn, rhocustomcds1, "CustomCDS", 1, 'Rho')
    read_samples_data(conn, rhocustomcds2, "CustomCDS", -1, 'Rho')
    read_samples_data(conn, rhomedian1, "Median", 1, 'Rho')
    read_samples_data(conn, rhomedian2, "Median", -1, 'Rho')

if __name__ == "__main__":
    main()
