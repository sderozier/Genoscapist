#
#     name : config.py
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

import os

# Deployment Environment
# local | dev | prod | demo
DEPLOY = "demo"

# Specie Accession
# Subtilis = AL009126 | Aureus = CP000253
SPECIE = "AL009126"
#SPECIE = "CP000253"

# Database Informations
if SPECIE == "AL009126":
    if DEPLOY != "demo":
        DB_USER = ""
        DB_PWD = ""
        DB_NAME = "seb"
        MIN_CUSTOM = 6.8
        MAX_CUSTOM = 16.5
        MIN_MEDIAN = -3.8
        MAX_MEDIAN = 9.5
    else:
        DB_USER = "read_user"
        DB_PWD = "sebuser2020"
        DB_NAME = "seb_demo"
        MIN_CUSTOM = 6.8
        MAX_CUSTOM = 16.5
        MIN_MEDIAN = -2.7
        MAX_MEDIAN = 9.5
    PATH = "/seb"
    NAME = "<i>B. subtilis</i> Expression Data Browser"

elif SPECIE == "CP000253":
    DB_USER = ""
    DB_PWD = ""
    DB_NAME = "aeb"
    PATH = "/aeb"
    NAME = "<i>S. aureus</i> Expression Data Browser"
    MIN_CUSTOM = 4.6
    MAX_CUSTOM = 16.5
    MIN_MEDIAN = -6.0
    MAX_MEDIAN = 8.9

if DEPLOY in ("local", "demo") :
    DB_HOST = "localhost"
    PATH = ""
elif DEPLOY == "dev":
    DB_HOST = ""
else:
    DB_HOST = ""
    
DB_PORT = "5432"

# Directory Informations
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
TEMPLATE_DIR = os.path.abspath(os.path.join(BASE_DIR, "templates"))
STATIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "static"))
