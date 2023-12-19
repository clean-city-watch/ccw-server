insert into statuses (name) values ('Open');
insert into statuses (name) values ('In Progress');
insert into statuses (name) values ('In Review');
insert into statuses (name) values ('Resolved');
insert into statuses (name) values ('Reopened');
insert into statuses (name) values ('On Hold');
insert into statuses (name) values ('Invalid');
insert into statuses (name) values ('Blocked');

INSERT INTO public.users(email,  password) VALUES ( 'admin@gmail.com', '$2b$10$ObLxqeKtG0bSmrDLyI64Y.L.LJe/k33g4sVFsft5gDmHYId7uH/7G');

INSERT INTO public.super_roles(name) VALUES ( 'ADMIN');
INSERT INTO public.super_roles(name) VALUES ( 'MODERATOR');
INSERT INTO public.super_roles(name) VALUES ( 'VIEWER');

INSERT INTO public.organization_roles(name) VALUES ( 'ADMIN');
INSERT INTO public.organization_roles(name) VALUES ( 'MODERATOR');
INSERT INTO public.organization_roles(name) VALUES ( 'VIEWER');

INSERT INTO public.community_roles(name) VALUES ( 'ADMIN');
INSERT INTO public.community_roles(name) VALUES ( 'MODERATOR');
INSERT INTO public.community_roles(name) VALUES ( 'VIEWER');

INSERT INTO public.users_super_roles(user_id, super_role_id) VALUES ( 1, 1);