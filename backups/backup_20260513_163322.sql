--
-- PostgreSQL database dump
--

\restrict 6LUfAXqek2xr30jGfxQDAk5uCvb0bHNK47TMG7fCUXC344LRvpdJilcK8hvksiu

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    game_id integer,
    quantity integer NOT NULL,
    price_at_purchase numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO admin;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO admin;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    total numeric(10,2),
    status character varying(20) DEFAULT 'completed'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO admin;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO admin;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: price_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.price_history (
    id integer NOT NULL,
    game_id integer,
    precio numeric(10,2) NOT NULL,
    fecha date DEFAULT CURRENT_DATE
);


ALTER TABLE public.price_history OWNER TO admin;

--
-- Name: price_history_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.price_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.price_history_id_seq OWNER TO admin;

--
-- Name: price_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.price_history_id_seq OWNED BY public.price_history.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255),
    password character varying(255) NOT NULL,
    is_admin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: videojuegos; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.videojuegos (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    precio numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    categoria character varying(100),
    plataforma character varying(50),
    imagen_url text
);


ALTER TABLE public.videojuegos OWNER TO admin;

--
-- Name: videojuegos_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.videojuegos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.videojuegos_id_seq OWNER TO admin;

--
-- Name: videojuegos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.videojuegos_id_seq OWNED BY public.videojuegos.id;


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: price_history id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.price_history ALTER COLUMN id SET DEFAULT nextval('public.price_history_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: videojuegos id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.videojuegos ALTER COLUMN id SET DEFAULT nextval('public.videojuegos_id_seq'::regclass);


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.order_items (id, order_id, game_id, quantity, price_at_purchase) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.orders (id, user_id, total, status, created_at) FROM stdin;
\.


--
-- Data for Name: price_history; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.price_history (id, game_id, precio, fecha) FROM stdin;
1	1	79.99	2026-04-13
2	1	75.00	2026-04-28
3	1	69.99	2026-05-13
4	2	69.99	2026-04-13
5	2	65.00	2026-04-23
6	2	59.99	2026-05-13
7	3	49.99	2026-04-13
8	3	39.99	2026-05-03
9	3	29.99	2026-05-13
10	4	79.99	2026-04-13
11	5	69.99	2026-04-13
12	6	49.99	2026-04-13
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, email, password, is_admin) FROM stdin;
1	admin	admin@tennostore.com	$2b$10$/dCthRhOby7UZUtNEQjRI.tpPxMd.4OJXPdqPyhPx9jX.4lfQQaSe	t
2	user	user@example.com	$2b$10$Ou2.1XZTFX2ZhgHhYSlzIO23h4LrGbfqa9YKjKDSqsgVj.mOm4qeK	f
\.


--
-- Data for Name: videojuegos; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.videojuegos (id, titulo, precio, stock, categoria, plataforma, imagen_url) FROM stdin;
1	The Legend of Zelda: Tears of the Kingdom	69.99	15	Aventura	NINTENDO	https://res.cloudinary.com/dudsuvnu0/image/upload/v1778292730/2x1_NSwitch_TloZTearsOfTheKingdom_Gamepage_image1600w_m25mvo.jpg
2	Elden Ring	59.99	8	RPG	PC, PLAYSTATION, XBOX	https://res.cloudinary.com/dudsuvnu0/image/upload/v1778293573/8BDt7H1bBfOhd2G4X20G6RQv_mohnhp.jpg
3	Cyberpunk 2077	29.99	25	Acción	PC, XBOX, PLAYSTATION	https://res.cloudinary.com/dudsuvnu0/image/upload/v1778292842/cyberpunk-2077-8_xtyoo1.jpg
4	Spider-Man 2	79.99	12	Acción	PLAYSTATION	https://res.cloudinary.com/dudsuvnu0/image/upload/v1778621345/2028edeaf4c0b60142550a3d6e024b6009853ceb9f51591e_rke4oa.jpg
5	Starfield	69.99	20	RPG	PC, XBOX	https://res.cloudinary.com/dudsuvnu0/image/upload/v1778621424/ION_Journey_Through_Space_16x9_Center_a6vb0g.jpg
6	Mario Kart 8 Deluxe	49.99	30	Carreras	NINTENDO	https://res.cloudinary.com/dudsuvnu0/image/upload/v1778621457/H2x1_NSwitch_MarioKart8Deluxe_image1600w_wtwi9a.jpg
\.


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: price_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.price_history_id_seq', 12, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: videojuegos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.videojuegos_id_seq', 6, true);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: price_history price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: videojuegos videojuegos_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.videojuegos
    ADD CONSTRAINT videojuegos_pkey PRIMARY KEY (id);


--
-- Name: videojuegos videojuegos_titulo_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.videojuegos
    ADD CONSTRAINT videojuegos_titulo_key UNIQUE (titulo);


--
-- Name: order_items order_items_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.videojuegos(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: price_history price_history_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.videojuegos(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6LUfAXqek2xr30jGfxQDAk5uCvb0bHNK47TMG7fCUXC344LRvpdJilcK8hvksiu

