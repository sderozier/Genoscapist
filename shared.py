#
#     name : shared.py
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

class Gene:

    def __init__(self, id, name, locustag, start, stop, strand,
                 clustera, clusterb, clusterc,
                 highexprcond, highexprval, lowexpcond, lowexpval,
                 poscorname, poscorval, negcorname, negcorval):

        self.name = name
        self.locustag = locustag
        self.start = start
        self.stop = stop
        self.strand = strand
        self.clustera = clustera
        self.clusterb = clusterb
        self.clusterc = clusterc
        self.highexprcond = highexprcond
        self.highexprval = highexprval
        self.lowexpcond = lowexpcond
        self.lowexpval = lowexpval
        self.poscorname = poscorname
        self.poscorval = poscorval
        self.negcorname = negcorname
        self.negcorval = negcorval

class Deletion:

    def __init__(self, id, name, start, stop, strand, type):

        self.name = name
        self.start = start
        self.stop = stop
        self.strand = strand
        self.type = type
