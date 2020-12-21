/**
#     name : environment.yml
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
**/

/* SCHEMA */
CREATE SCHEMA bacteries AUTHORIZATION admin_user;
GRANT ALL ON SCHEMA bacteries TO admin_user;
GRANT USAGE ON SCHEMA bacteries TO read_user;
SET search_path to bacteries;

/* FEATURE MANAGER */
CREATE TABLE bacteries.features_manager
  (
    id            serial         unique not null,
    type          varchar(20)    not null,
    position      int            not null,

    primary key(id)
  );

/* SPECIES */
CREATE TABLE bacteries.species
  (
    id            serial         unique not null,
    name          varchar(100)   not null,
    nucleic       varchar(200),
    nucleic_date  date,
    proteic       varchar(200),
    proteic_date  date,

    primary key(id)
  );

/* SEQUENCES */
CREATE TABLE bacteries.sequences
  (
    id          serial         unique not null,
    accession   varchar(25)    unique not null,
    name        varchar(25),
    species_id  int            not null,
    length      int4           default 0,
    molecule    varchar(30),
    subbank     varchar(30),
    date        date,
    definition  varchar(600),
    version     varchar(30),
    segment     varchar(25),
    source      varchar(400),
    nba         int4,
    nbc         int4,
    nbg         int4,
    nbt         int4,
    nbo         int4,
    origin      varchar(100),

    primary key(id),
    unique(accession,species_id),

    foreign key(species_id) references bacteries.species(id) on delete CASCADE
  );

/* FEATURES */
CREATE TABLE bacteries.features
  (
    sequence_id  int             not null,
    id           serial          unique not null,
    type         varchar(50),
    location     varchar(2000),
    complement   int2,
    comments     varchar(200),
    start        int4            not null,
    stop         int4            not null,
    id_feat      varchar(100)    not null,
    date         date,
    dna_feat_id  int,
    smallInfo    varchar(100),
    color        varchar(200),
    clusterA 	character varying(5),
    clusterB	character varying(5),
    clusterC	character varying(5),

    primary key(id),

    foreign key(sequence_id) references bacteries.sequences(id) on delete CASCADE
  );

/* LOCATIONS */
CREATE TABLE bacteries.locations
  (
    id          serial   unique not null,
    feature_id  int      not null,
    start       int4     not null,
    stop        int4     not null,
    complement  int2     not null,

    primary key(id),

    foreign key(feature_id) references bacteries.features(id) on delete CASCADE
  );

/* QUALIFIERS */
CREATE TABLE bacteries.qualifiers
  (
    id          serial          unique not null,
    feature_id  int             not null,
    type        varchar(50)     not null,
    value       varchar(4000),

    primary key(id),

    foreign key(feature_id) references bacteries.features(id) on delete CASCADE
  );

/* EXP_GROUP */
CREATE TABLE bacteries.exp_group
 (
   id serial unique not null,
   description text not null,
   reference text,
   name character varying(60),
   primary key(id)
 );

/* EXPERIENCES */
CREATE TABLE bacteries.exp_seq
 (
   id serial NOT NULL,
   sequence_id character varying(30) NOT NULL,
   chip_id character varying(30) NOT NULL,
   experience character varying(60) NOT NULL,
   project character varying(60) NOT NULL,
   normalization character varying(30),
   strand smallint,
   color character varying(60),
   info smallint,
   exp_group_id int,
   number smallint,
   replicate smallint,
   rcolor character varying(20),
   CONSTRAINT exp_seq_pkey PRIMARY KEY (id),
   CONSTRAINT exp_seq_info FOREIGN KEY (exp_group_id)
   REFERENCES bacteries.exp_group (id) on delete CASCADE
 );

/* EXPRESSION */
CREATE TABLE bacteries.expression
 (
   id serial NOT NULL,
   exp_seq_id integer NOT NULL,
   position integer NOT NULL,
   signal double precision NOT NULL,
   CONSTRAINT expression_pkey PRIMARY KEY (id),
   CONSTRAINT expression_exp_seq_fkey FOREIGN KEY (exp_seq_id)
   REFERENCES bacteries.exp_seq (id) on delete CASCADE
 );

/* CLUSTERS */
CREATE TABLE bacteries.cluster
 (
   id serial NOT NULL,
   name character varying(5) NOT NULL,
   CONSTRAINT cluster_pkey PRIMARY KEY (id)
 );

CREATE TABLE bacteries.feat_cluster
  (
    feature_id  int             not null,
    cluster_id  int             not null,
    foreign key(feature_id) references bacteries.features(id) on delete CASCADE,
    foreign key(cluster_id) references bacteries.cluster(id) on delete CASCADE
  );

/* CONDITIONS */
CREATE TABLE bacteries.condition
 (
   id serial NOT NULL,
   name character varying(50) NOT NULL,
   CONSTRAINT condition_pkey PRIMARY KEY (id)
 );

CREATE TABLE bacteries.feat_condition
  (
    feature_id  int  not null,
    condition_id  int  not null,
    value double precision not null,
    expression int2 not null,
    foreign key(feature_id) references bacteries.features(id) on delete CASCADE,
    foreign key(condition_id) references bacteries.condition(id) on delete CASCADE
  );

/* SEGMENTS */
CREATE TABLE bacteries.segment
 (
   id serial NOT NULL,
   name character varying(50) NOT NULL,
   CONSTRAINT segment_pkey PRIMARY KEY (id)
 );

CREATE TABLE bacteries.feat_segment
  (
    feature_id  int  not null,
    segment_id  int  not null,
    value double precision not null,
    correlation int2 not null,
    foreign key(feature_id) references bacteries.features(id) on delete CASCADE,
    foreign key(segment_id) references bacteries.segment(id) on delete CASCADE
  );

/* AXIS */
CREATE TABLE bacteries.axis
 (
   id serial NOT NULL,
   sequence_id integer NOT NULL,
   complement smallint,
   color character varying(200),
   x1 double precision NOT NULL,
   y1 double precision NOT NULL,
   x2 double precision NOT NULL,
   y2 double precision NOT NULL,

   CONSTRAINT axis_pkey PRIMARY KEY (id),

   CONSTRAINT axis_seq_fkey FOREIGN KEY(sequence_id)
   REFERENCES bacteries.sequences(id) MATCH SIMPLE
 );

/* GRANT */
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.features TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.locations TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.qualifiers TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.sequences TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.species TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.features_id_seq TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.locations_id_seq TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.qualifiers_id_seq TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.sequences_id_seq TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.species_id_seq TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.exp_seq TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.exp_seq_id_seq TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.expression TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.expression_id_seq TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.cluster TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.feat_cluster TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.condition TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.feat_condition TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.segment TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.feat_segment TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.axis TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.exp_group TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.exp_group_id_seq TO admin_user;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE bacteries.features_manager TO admin_user;
GRANT SELECT ON TABLE bacteries.features TO read_user;
GRANT SELECT ON TABLE bacteries.locations TO read_user;
GRANT SELECT ON TABLE bacteries.qualifiers TO read_user;
GRANT SELECT ON TABLE bacteries.sequences TO read_user;
GRANT SELECT ON TABLE bacteries.species TO read_user;
GRANT SELECT ON TABLE bacteries.features_id_seq TO read_user;
GRANT SELECT ON TABLE bacteries.locations_id_seq TO read_user;
GRANT SELECT ON TABLE bacteries.qualifiers_id_seq TO read_user;
GRANT SELECT ON TABLE bacteries.sequences_id_seq TO read_user;
GRANT SELECT ON TABLE bacteries.species_id_seq TO read_user;
GRANT SELECT ON TABLE bacteries.exp_seq TO read_user;
GRANT SELECT ON TABLE bacteries.exp_seq_id_seq TO read_user;
GRANT SELECT ON TABLE bacteries.expression TO read_user;
GRANT SELECT ON TABLE bacteries.expression_id_seq TO read_user;
GRANT SELECT ON TABLE bacteries.cluster TO read_user;
GRANT SELECT ON TABLE bacteries.feat_cluster TO read_user;
GRANT SELECT ON TABLE bacteries.condition TO read_user;
GRANT SELECT ON TABLE bacteries.feat_condition TO read_user;
GRANT SELECT ON TABLE bacteries.segment TO read_user;
GRANT SELECT ON TABLE bacteries.feat_segment TO read_user;
GRANT SELECT ON TABLE bacteries.axis TO read_user;
GRANT SELECT ON TABLE bacteries.exp_group TO read_user;
GRANT SELECT ON TABLE bacteries.exp_group_id_seq TO read_user;
GRANT SELECT ON TABLE bacteries.features_manager TO read_user;

/* INDEX */
CREATE INDEX speciesIDX1 ON species(name);
CREATE INDEX species_idx1 ON bacteries.species USING btree (name);
CREATE INDEX sequences_idx1 ON bacteries.sequences USING btree (species_id, accession);
CREATE INDEX sequencesidx2 ON bacteries.sequences USING btree (accession);
CREATE INDEX feature_idx3 ON bacteries.features USING btree (id);
CREATE INDEX features_idx1 ON bacteries.features USING btree (sequence_id, "type", "start", stop);
CREATE INDEX features_idx2 ON bacteries.features USING btree (id_feat);
CREATE INDEX features_type ON bacteries.features USING btree ("type");
CREATE INDEX locationsIDX1 ON bacteries.locations(feature_id,start);
CREATE INDEX qualifiers_idx1 ON bacteries.qualifiers USING btree (feature_id);
CREATE INDEX qualifiers_idx2 ON bacteries.qualifiers USING btree (feature_id, "type");
CREATE INDEX qualifiers_type ON bacteries.qualifiers USING btree ("type");
CREATE INDEX cluster_name ON bacteries.cluster USING btree (name);
CREATE INDEX expression_position_expid ON bacteries.expression USING btree (position, exp_seq_id);
