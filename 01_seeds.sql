INSERT INTO users (name, email, password)
VALUES ('Randy', 'Randy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('Randy', 'Randy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('Randy', 'Randy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties ( title, owner_id, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES ( 'Huge Home',1, 'www.photo.com', 'www.photo2.com', 48, 3, 3, 4, 'Canada', 'Louis', 'Toronto', 'Ontario','n9ag5g', FALSE),
( 'Huge Home',2, 'www.photo.com', 'www.photo2.com', 48, 3, 3, 4, 'Canada', 'Louis', 'Toronto', 'Ontario','n9ag5g', TRUE),
( 'Huge Home',3, 'www.photo.com', 'www.photo2.com', 48, 3, 3, 4, 'Canada', 'Louis', 'Toronto', 'Ontario','n9ag5g', FALSE);

INSERT INTO reservations ( start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 4, 'MESSAGE'),
 (2, 3, 1, 5, 'MESSAGE'),
 (3, 2, 1, 2, 'MESSAGE');

