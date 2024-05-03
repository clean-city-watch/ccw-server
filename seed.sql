INSERT INTO statuses (name) VALUES ('Open');
INSERT INTO statuses (name) VALUES ('In Progress');
INSERT INTO statuses (name) VALUES ('In Review');
INSERT INTO statuses (name) VALUES ('Resolved');
INSERT INTO statuses (name) VALUES ('Reopened');
INSERT INTO statuses (name) VALUES ('On Hold');
INSERT INTO statuses (name) VALUES ('Invalid');
INSERT INTO statuses (name) VALUES ('Blocked');

INSERT INTO public.users(email,  password) VALUES ( 'admin@gmail.com', '$2b$10$ObLxqeKtG0bSmrDLyI64Y.L.LJe/k33g4sVFsft5gDmHYId7uH/7G');
INSERT INTO public.user_profiles (user_id) VALUES (1);

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