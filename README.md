# Wigell Car Rental

## Beskrivning

Wigell Car Rental är en webbaserad SPA-applikation för biluthyrning. Projektet består av en Spring Boot-backend och en frontend byggd med HTML, CSS och JavaScript utan ramverk.

Applikationen har två delar:

* Kundvy där användare kan logga in, se bilar, sortera bilar och skapa bokningar.
* Adminvy där administratörer kan hantera bilar, användare och bokningar.

Projektet är skapat enligt kravspecifikationen för Wigellkoncernens nya bokningssystem för biluthyrning.

---

## Tekniker

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* MySQL
* REST API
* Basic Authentication
* CORS

### Frontend

* HTML
* CSS
* JavaScript
* SPA-struktur
* Responsiv design
* Tillgänglighetsanpassningar enligt WCAG-principer

---

## Funktioner

### Kundfunktioner

* Logga in med användarnamn och lösenord
* Registrera nytt konto
* Visa tillgängliga bilar
* Sortera bilar efter namn, typ och pris
* Söka efter bilar
* Boka en bil
* Välja datum via kalender
* Se egna bokningar
* Se sin profil

### Adminfunktioner

* Visa alla bilar
* Lägga till ny bil
* Redigera bil
* Ta bort bil
* Visa alla användare
* Redigera användare
* Ta bort användare
* Visa alla bokningar
* Redigera bokningar
* Avsluta/returnera bokningar
* Ta bort bokningar
* Sortera admin-tabeller stigande och fallande
* Expanderbara tabellrader på mindre skärmar

---

## Demoanvändare

Under utveckling och demo används följande användare:

| Roll  | Användarnamn | Lösenord |
| ----- | ------------ | -------- |
| Kund  | `user`       | `user`   |
| Admin | `admin`      | `admin`  |

Dessa användare behöver finnas i databasen innan demo.

---

## Projektstruktur

Exempel på frontend-struktur:


carRentalFrontend/
│
├── index.html
├── css/
│   ├── main.css
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── tables.css
│   ├── modals.css
│   └── accessibility.css
│
├── js/
│   ├── config.js
│   ├── utils.js
│   ├── auth.js
│   ├── navigation.js
│   ├── cars.js
│   ├── bookings.js
│   ├── profile.js
│   ├── admin-bookings.js
│   ├── admin-users.js
│   ├── admin-cars.js
│   └── main.js
│
└── images/


Backend är byggd med Spring Boot och innehåller bland annat:


src/main/java/com/wigell/
│
├── config/
├── controllers/
├── dao/
├── dto/
├── entities/
└── services/


---

## Installation och körning

### 1. Starta databasen

Projektet använder MySQL.

Databasen heter:


rental


Kontrollera att MySQL körs och att användarnamn/lösenord i `application.properties` stämmer.

Exempel:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rental?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

---

### 2. Starta backend

Gå till backend-projektets root-mapp och kör Spring Boot-applikationen.

Backend körs på:


http://localhost:8080


API-basväg:


http://localhost:8080/api/v1


---

### 3. Starta frontend

Frontend kan köras med exempelvis Live Server i VS Code.

Rekommenderad adress:

http://127.0.0.1:5500


Det är viktigt eftersom backendens CORS-konfiguration tillåter denna origin.

---

## Viktiga API-endpoints

### Auth

| Metod | Endpoint             | Beskrivning         |
| ----- | -------------------- | ------------------- |
| POST  | `/api/v1/auth/login` | Loggar in användare |

### Cars

| Metod  | Endpoint            | Beskrivning            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/v1/cars`      | Hämtar alla bilar      |
| GET    | `/api/v1/cars/{id}` | Hämtar en specifik bil |
| POST   | `/api/v1/cars`      | Lägger till bil        |
| PUT    | `/api/v1/cars/{id}` | Uppdaterar bil         |
| DELETE | `/api/v1/cars/{id}` | Tar bort bil           |

### Users

| Metod  | Endpoint             | Beskrivning               |
| ------ | -------------------- | ------------------------- |
| GET    | `/api/v1/users`      | Hämtar alla användare     |
| GET    | `/api/v1/users/{id}` | Hämtar specifik användare |
| POST   | `/api/v1/users`      | Skapar användare          |
| PUT    | `/api/v1/users/{id}` | Uppdaterar användare      |
| DELETE | `/api/v1/users/{id}` | Tar bort användare        |

### Bookings

| Metod  | Endpoint                       | Beskrivning                          |
| ------ | ------------------------------ | ------------------------------------ |
| GET    | `/api/v1/bookings`             | Hämtar alla bokningar                |
| GET    | `/api/v1/bookings/me`          | Hämtar inloggad användares bokningar |
| GET    | `/api/v1/bookings/active`      | Hämtar aktiva bokningar              |
| GET    | `/api/v1/bookings/{id}`        | Hämtar specifik bokning              |
| POST   | `/api/v1/bookings`             | Skapar bokning                       |
| PUT    | `/api/v1/bookings/{id}`        | Uppdaterar bokning                   |
| PUT    | `/api/v1/bookings/return/{id}` | Avslutar/returnerar bokning          |
| DELETE | `/api/v1/bookings/{id}`        | Tar bort bokning                     |

---

## Säkerhet

Projektet använder Spring Security med Basic Authentication.

Roller som används:


ROLE_USER
ROLE_ADMIN

Admin har tillgång till administrationsfunktioner som att hantera bilar, användare och bokningar.

Kund kan logga in, se bilar och skapa bokningar.

CORS är konfigurerat så att frontend kan kommunicera med backend från:


http://127.0.0.1:5500

---

## Responsiv design

Frontend är byggd för att fungera på både större och mindre skärmar.

Exempel på responsiva lösningar:

* Bilkort anpassas efter skärmbredd.
* Admin-tabeller får expanderbara rader på mindre skärmar.
* Erbjudanden flyttas under huvudinnehållet på mindre skärmar.
* Meny och layout anpassas för mobil och tablet.

---

## Tillgänglighet

Projektet innehåller flera tillgänglighetsanpassningar:

* Skip-link för att hoppa till huvudinnehåll
* Tydliga labels på formulärfält
* `aria-label` på knappar
* `aria-live` för felmeddelanden och statusmeddelanden
* Tangentbordsstöd för modal
* Responsiv layout
* Fokusmarkeringar i formulär
* Semantiska HTML-element som `header`, `nav`, `main` och `aside`

---

## Styleguide

Projektet använder en egen visuell stil med definierade färger, typsnitt, knappar, kort, formulär och tabeller.

Styleguiden bör bifogas projektet som exempelvis:

STYLEGUIDE.md

Styleguiden ska beskriva:

* Färgpalett
* Typsnitt
* Knappar
* Formulär
* Tabeller
* Kort
* Responsiv design
* Tillgänglighetsprinciper

---

## Testning

Följande funktioner bör testas innan inlämning:

* Logga in som kund
* Logga in som admin
* Registrera ny användare
* Visa bilar
* Sortera bilar efter namn och typ
* Skapa bokning
* Kontrollera att bokad bil inte visas som tillgänglig
* Visa egna bokningar
* Admin: visa alla bokningar
* Admin: avsluta bokning
* Admin: ta bort bokning
* Admin: lägga till bil
* Admin: redigera bil
* Admin: ta bort bil
* Admin: visa användare
* Admin: redigera användare
* Admin: ta bort användare
* Testa responsiv layout på mindre skärm
* Testa sortering i admin-tabeller

---

## Kända begränsningar

* Projektet är byggt för lokal utveckling och demo.
* Basic Authentication används enligt kravspecifikationen.
* Backend bör ansvara för all kritisk validering i en produktionsmiljö.
* Frontend-validering används för bättre användarupplevelse, men bör inte vara den enda säkerhetsnivån.

---

## Författare

Projektet är skapat som ett frontendprojekt för Wigellkoncernens biluthyrningssystem.

Utvecklat med:

HTML, CSS, JavaScript, Spring Boot och MySQL
