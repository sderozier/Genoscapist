#
#     name : __init__.py
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

from flask import Flask
from flask import url_for
from flask import render_template
from flask import request
from flask import g, jsonify
from genoscapist.config import *
from genoscapist.database import *
from genoscapist.shared import *

app = Flask(__name__,
            template_folder=TEMPLATE_DIR,
            static_url_path='',
            static_folder=STATIC_DIR)
app.debug = True

# Database connexion
conn = connect_db(app)

# Sequence length
seqlen = get_sequence(app, conn, SPECIE)

# Features order
list_features = get_list_features(app, conn)

# Samples
samples = get_list_samples(app, conn)
groups = get_list_groups(app, conn)
rho_group_desc = get_rho_description(app, conn)

# Index page (genes list)
@app.route('/')
def index():
    clusters = get_clusters_list(app, conn)
    identifiers = get_identifiers_list(app, conn)

    cluster = request.args.get('cluster', None)
    position = request.args.get('position', None)

    if cluster != None:
        genes = get_genes_with_cluster(app, cluster, conn)
    elif position != None:
        genes = get_genes_with_position(app, position, conn)
    else:
        genes = get_genes_list(app, conn)

    return render_template('index.html', genes=genes, seqlen=seqlen, clusters=clusters, identifiers=identifiers, path=PATH, name=NAME)

# Genomic view
@app.route('/viewer/')
def view():
    locus = request.args.get('id', None)
    start = request.args.get('start', None)
    width = request.args.get('size', None)
    norm = request.args.get('norm', None)
    rho = request.args.get('rho', None)
    feat = request.args.get('fname', None)
    selexp = request.args.getlist("exp", None)
    selcolor = request.args.getlist("color", None)

    if locus != None:
        gene = get_gene(app, locus, conn)
        return render_template('gene.html', gene=gene, size=width, seqlen=seqlen, norm=norm, rho=rho, feat=feat, \
                                            rho_group_desc=rho_group_desc, list_features=list_features, \
                                            samples=samples, groups=groups, path=PATH, name=NAME, \
                                            min_CustomCDS=MIN_CUSTOM, max_CustomCDS=MAX_CUSTOM, \
                                            min_Median=MIN_MEDIAN, max_Median=MAX_MEDIAN, \
                                            selexp=selexp, selcolor=selcolor)

    else:
        return render_template('gene.html', start=start, size=width, seqlen=seqlen, norm=norm, rho=rho, feat=feat, \
                                            rho_group_desc=rho_group_desc, list_features=list_features, \
                                            samples=samples, groups=groups, path=PATH, name=NAME, \
                                            min_CustomCDS=MIN_CUSTOM, max_CustomCDS=MAX_CUSTOM, \
                                            min_Median=MIN_MEDIAN, max_Median=MAX_MEDIAN, \
                                            selexp=selexp, selcolor=selcolor)

# Others pages (help, contact, docs, references)
@app.route('/references')
def references():
    return render_template('references.html', name=NAME)
    # return render_template('references.html', name=NAME, path=PATH)
@app.route('/contact')
def contact():
    return render_template('contact.html')
    # return render_template('contact.html', name=NAME, path=PATH)

# Get data
@app.route('/_get_transterms')
def get_transterms():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    return(get_list_transterms(app, SPECIE, f, to, conn))

@app.route('/_get_cds')
def get_cds():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    return(get_list_cds(app, SPECIE, f, to, "CDS", conn))

@app.route('/_get_beaume')
def get_beaume():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    return(get_list_beaume(app, SPECIE, f, to, conn))

@app.route('/_get_segments')
def get_segments():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    return(get_list_segments(app, SPECIE, f, to, conn))

@app.route('/_get_promotors')
def get_promotors():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    return(get_list_promotors(app, SPECIE, f, to, conn))

@app.route('/_get_terminators')
def get_terminators():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    return(get_list_terminators(app, SPECIE, f, to, conn))

@app.route('/_get_lines')
def get_lines():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    return(get_list_lines(app, SPECIE, f, to, conn))

@app.route('/_get_list_all_exp')
def get_allexp():
    norm = request.args.get('norm', 0, type=str)
    return(get_list_all_exp(app, SPECIE, norm, conn))

@app.route('/_get_defaultexp')
def get_defaultexp():
    norm = request.args.get('norm', 0, type=str)
    return(get_list_default_exp(app, SPECIE, norm, conn))

@app.route('/_get_selected_exp')
def get_selected_exp():
    norm = request.args.get('norm', 0, type=str)
    list = request.args.get('list', 0, type=str)
    return(get_list_selected_exp(app, SPECIE, norm, list, conn))

@app.route('/_get_rhoexp')
def get_rhoexp():
    norm = request.args.get('norm', 0, type=str)
    return(get_list_rho_exp(app, SPECIE, norm, conn))

@app.route('/_get_rhogroups')
def get_rhogroups():
    norm = request.args.get('norm', 0, type=str)
    return(get_list_rho_groups(app, norm, conn))

@app.route('/_get_rhoregions')
def get_rhoregions():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    group = request.args.get('group', 0, type=str)
    return(get_list_rho_region(app, SPECIE, f, to, "rho_up_region", group, conn))

@app.route('/_get_expression')
def get_expression():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    id = request.args.get('id', 0, type=int)
    seq_size = request.args.get('seq_size', 0, type=int)
    return(get_list_expression(app, SPECIE, f, to, id, seq_size, conn))

@app.route('/_get_blank')
def get_blank():
    f = request.args.get('start', 0, type=int)
    to = request.args.get('stop', 0, type=int)
    return(get_list_region(app, SPECIE, f, to, conn))

@app.route('/_get_genbank')
def get_genbank():
    locus = request.args.get('locus', 0, type=str)
    return(get_genbank_info(app, locus, conn))

@app.route('/_get_infos')
def get_infos():
    locus = request.args.get('locus', 0, type=str)
    return(get_add_info(app, locus, conn))

@app.route('/_get_conditions')
def get_conditions():
    locus = request.args.get('locus', 0, type=str)
    level = request.args.get('level', 0, type=int)
    return(get_exp_conditions(app, locus, level, conn))

@app.route('/_get_corr_segments')
def get_corr_segments():
    locus = request.args.get('locus', 0, type=str)
    level = request.args.get('level', 0, type=int)
    return(get_correl_segments(app, locus, level, conn))

# Tests URL
with app.test_request_context():
    print(url_for('index'))
