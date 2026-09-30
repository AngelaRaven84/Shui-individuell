# Shui

Shui är en meddelandeapp där besökare kan läsa meddelanden och filtrera dem efter användare. Den som registrerar ett konto och loggar in kan publicera egna meddelanden samt redigera och radera dem.

Frontend är byggd med React och Vite. Backend använder AWS Lambda, API Gateway och DynamoDB och deployas med Serverless Framework. Frontend publiceras på Amazon S3 och nås via CloudFront.

## Testa appen

[Öppna Shui](https://d19ccgqansmqjt.cloudfront.net)

Du kan läsa meddelanden utan att logga in. Registrera ett konto för att testa att skapa meddelanden och redigera eller radera dina egna.

## Starta projektet lokalt

Frontend körs lokalt med Vite och ansluter till projektets publicerade API i AWS. Du behöver inte något eget AWS-konto.

### Förutsättningar

- Node.js 24 och npm
- Git

### Installation

1. Klona repot:

   ```bash
   git clone https://github.com/AngelaRaven84/Shui-individuell.git
   ```

2. Gå till frontendens mapp och installera beroendena:

   ```bash
   cd Shui-individuell/shui-frontend
   npm ci
   ```

3. Skapa filen `.env.local` i mappen `shui-frontend` och lägg till:

   ```env
   VITE_API_URL=https://obklixh80h.execute-api.eu-north-1.amazonaws.com
   ```

4. Starta utvecklingsservern:

   ```bash
   npm run dev
   ```

5. Öppna http://localhost:5173 i webbläsaren.

API:t tillåter lokala anrop från http://localhost:5173. Se därför till att port 5173 är ledig när du startar frontend.

Den lokala frontenden använder samma databas som den publicerade appen. Meddelanden som du skapar, ändrar eller raderar påverkas därför även där.

## API

### Basadress

https://obklixh80h.execute-api.eu-north-1.amazonaws.com

### Endpoints

| Metod  | Sökväg                          | Funktion                        |
| ------ | ------------------------------- | ------------------------------- |
| GET    | `/messages`                     | Hämta alla meddelanden          |
| GET    | `/users/{username}/messages`    | Hämta en användares meddelanden |
| GET    | `/users/{userId}/messages/{id}` | Hämta ett specifikt meddelande  |
| POST   | `/auth/register`                | Registrera ett konto            |
| POST   | `/auth/login`                   | Logga in och få en JWT          |
| POST   | `/messages`                     | Skapa ett meddelande            |
| PATCH  | `/users/{userId}/messages/{id}` | Redigera ett eget meddelande    |
| DELETE | `/users/{userId}/messages/{id}` | Radera ett eget meddelande      |

`username` är användarnamnet, `userId` är användarens id och `id` är meddelandets id.

### Autentisering och behörighet

---

Alla GET-endpoints är offentliga och kan användas utan inloggning. Registrering och inloggning kräver inte heller någon token.

Vid lyckad inloggning returnerar API:t en JWT. För att skapa, redigera eller radera meddelanden skickas den i anropets header:

```http
Authorization: Bearer <din-token>
```

Ersätt `<din-token>` med token från inloggningssvaret.

Anrop med JSON i request body ska även ha denna header:

```http
Content-Type: application/json
```

Backend kopplar nya meddelanden till användaren som identifieras av token. Användaren får bara redigera och radera sina egna meddelanden. Behörigheten kontrolleras i backend.

En saknad, ogiltig eller utgången token ger status `401`. Försök att redigera eller radera en annan användares meddelande ger status `403`.

Frontend sparar token i React-state. Vid omladdning av sidan behöver användaren därför logga in igen.

### Registrera användare

---

`POST /auth/register`

Ingen token krävs. Skicka JSON med `username`, `email` och `password`.

Exempel på request body med påhittade uppgifter:

```json
{
	"username": "testuser",
	"email": "testuser@example.com",
	"password": "Exempelpass123!"
}
```

Validering:

- Användarnamn ska vara 3–30 tecken och innehålla a–z, siffror, bindestreck eller understreck.
- E-postadressen ska ha giltigt format och vara högst 254 tecken.
- Användarnamn och e-post trimmas och omvandlas till små bokstäver.
- Lösenord ska vara minst 8 tecken och högst 72 byte.
- Användarnamn och e-postadress måste vara unika.

Exempel på svar med status `201 Created`:

```json
{
	"message": "Användare skapades.",
	"user": {
		"id": "a1b2c3d4",
		"username": "testuser",
		"email": "testuser@example.com",
		"createdAt": "2026-09-30T10:00:00.000Z"
	}
}
```

Id och datum genereras av backend. Lösenordet lagras hashat med bcrypt och skickas inte tillbaka i svaret.

Felaktiga fält ger `400 Bad Request`. Ett upptaget användarnamn eller en upptagen e-postadress ger `409 Conflict`.

### Logga in

---

`POST /auth/login`

Ingen token krävs. Skicka JSON med e-post och lösenord för ett registrerat konto.

Exempel på request body med påhittade uppgifter:

```json
{
	"email": "testuser@example.com",
	"password": "Exempelpass123!"
}
```

Exempel på svar med status `200 OK`:

```json
{
	"token": "<JWT>"
}
```

`<JWT>` är en platshållare. Det riktiga svaret innehåller en signerad token som gäller i 15 minuter. Använd den i Authorization-headern vid skyddade anrop.

E-postadressen trimmas och omvandlas till små bokstäver före uppslagningen.

Saknade fält eller fel datatyper ger `400 Bad Request`. Fel e-post eller lösenord ger `401 Unauthorized`.

### Hämta alla meddelanden

---

`GET /messages`

Ingen token, request body eller query-parametrar krävs.

Exempel på anrop:

```http
GET https://obklixh80h.execute-api.eu-north-1.amazonaws.com/messages
```

Exempel på svar med status `200 OK` och påhittade uppgifter:

```json
[
	{
		"PK": "USER#a1b2c3d4",
		"SK": "MESSAGE#e5f6a7b8",
		"GSI1PK": "MESSAGES",
		"GSI1SK": "2026-09-30T10:05:00.000Z#e5f6a7b8",
		"id": "e5f6a7b8",
		"userId": "a1b2c3d4",
		"username": "testuser",
		"text": "Hej från Shui!",
		"createdAt": "2026-09-30T10:05:00.000Z"
	}
]
```

Meddelandena returneras med de nyaste först. Om inga meddelanden finns returneras en tom lista, `[]`.

Backend hämtar alla resultatsidor från DynamoDB och returnerar dem som en gemensam lista.

Svaret innehåller även databasens nyckelfält `PK`, `SK`, `GSI1PK` och `GSI1SK`.

### Hämta en användares meddelanden

---

`GET /users/{username}/messages`

Ingen token, request body eller query-parametrar krävs. Ersätt `{username}` i sökvägen med användarnamnet.

Exempel på anrop:

```http
GET https://obklixh80h.execute-api.eu-north-1.amazonaws.com/users/testuser/messages
```

Svaret har status `200 OK` och innehåller en lista med samma meddelandeformat som `GET /messages`, men endast för den valda användaren.

Om användaren saknas eller inte har några meddelanden returneras:

```json
[]
```

Användarnamnet trimmas och omvandlas till små bokstäver vid uppslagningen. Backend hämtar alla resultatsidor från DynamoDB.

Listan sorteras efter databasens sorteringsnyckel, som innehåller meddelandets id. Den här endpointen garanterar därför inte datumordning.

### Hämta ett specifikt meddelande

---

`GET /users/{userId}/messages/{id}`

Ingen token, request body eller query-parametrar krävs. Ersätt `{userId}` med meddelandets ägares id och `{id}` med meddelandets id.

Exempel på anrop med påhittade id:n:

```http
GET https://obklixh80h.execute-api.eu-north-1.amazonaws.com/users/a1b2c3d4/messages/e5f6a7b8
```

Exempel på svar med status `200 OK`:

```json
{
	"PK": "USER#a1b2c3d4",
	"SK": "MESSAGE#e5f6a7b8",
	"GSI1PK": "MESSAGES",
	"GSI1SK": "2026-09-30T10:05:00.000Z#e5f6a7b8",
	"id": "e5f6a7b8",
	"userId": "a1b2c3d4",
	"username": "testuser",
	"text": "Hej från Shui!",
	"createdAt": "2026-09-30T10:05:00.000Z"
}
```

Svaret innehåller ett objekt, inte en lista.

Om inget meddelande matchar kombinationen av användar-id och meddelande-id returneras `404 Not Found`:

```json
{
	"message": "Meddelandet hittades inte."
}
```

### Skapa ett meddelande

---

`POST /messages`

Kräver en giltig JWT. Skicka följande headers:

```http
Authorization: Bearer <din-token>
Content-Type: application/json
```

Exempel på request body:

```json
{
	"text": "Hej från Shui!"
}
```

`text` måste vara en sträng och får inte vara tom eller bara innehålla blanksteg. Blanksteg i början och slutet tas bort.

Backend hämtar användarens id från token och användarnamnet från användarprofilen. Klienten skickar därför bara meddelandets text. Meddelandets id och skapandedatum genereras av backend.

Exempel på svar med status `201 Created` och påhittade uppgifter:

```json
{
	"id": "e5f6a7b8",
	"userId": "a1b2c3d4",
	"username": "testuser",
	"text": "Hej från Shui!",
	"createdAt": "2026-09-30T10:05:00.000Z"
}
```

Ogiltig eller saknad text ger `400 Bad Request`. Saknad, ogiltig eller utgången token ger `401 Unauthorized`. Även en token vars användare inte längre finns ger `401`.

### Redigera ett meddelande

---

`PATCH /users/{userId}/messages/{id}`

Kräver en giltig JWT som tillhör meddelandets ägare. Ersätt `{userId}` med ägarens id och `{id}` med meddelandets id.

Skicka följande headers:

```http
Authorization: Bearer <din-token>
Content-Type: application/json
```

Exempel på request body:

```json
{
	"text": "Här är min uppdaterade text!"
}
```

`text` måste vara en sträng och får inte vara tom eller bara innehålla blanksteg. Blanksteg i början och slutet tas bort.

Endast meddelandets text ändras. Id, ägare och skapandedatum behålls.

Exempel på svar med status `200 OK` och påhittade uppgifter:

```json
{
	"id": "e5f6a7b8",
	"userId": "a1b2c3d4",
	"username": "testuser",
	"text": "Här är min uppdaterade text!",
	"createdAt": "2026-09-30T10:05:00.000Z"
}
```

Möjliga fel:

- `400 Bad Request`: saknad eller ogiltig text.
- `401 Unauthorized`: saknad, ogiltig eller utgången token.
- `403 Forbidden`: användar-id i sökvägen matchar inte användaren i token.
- `404 Not Found`: meddelandet finns inte under den inloggade användarens id.

### Radera ett meddelande

---

`DELETE /users/{userId}/messages/{id}`

Kräver en giltig JWT som tillhör meddelandets ägare. Ersätt `{userId}` med ägarens id och `{id}` med meddelandets id.

Ingen request body eller query-parametrar krävs.

Exempel på anrop med påhittade id:n:

```http
DELETE https://obklixh80h.execute-api.eu-north-1.amazonaws.com/users/a1b2c3d4/messages/e5f6a7b8
Authorization: Bearer <din-token>
```

Svar vid lyckad radering, med status `200 OK`:

```json
{
	"message": "Meddelandet raderades."
}
```

Möjliga fel:

- `401 Unauthorized`: saknad, ogiltig eller utgången token.
- `403 Forbidden`: användar-id i sökvägen matchar inte användaren i token.
- `404 Not Found`: meddelandet finns inte under den inloggade användarens id.

Om samma meddelande raderas igen returneras `404 Not Found`.

## Databasdesign

Projektet använder single-table design i DynamoDB. Användarprofiler, meddelanden och uppslagsposter lagras i samma tabell, `shui-dev`.

Tabellen definieras i `shui-backend/serverless.yml`. Primärnyckeln består av partitionsnyckeln `PK` och sorteringsnyckeln `SK`.

### Posttyper och nycklar

| Posttyp              | PK                    | SK             | Syfte                                       |
| -------------------- | --------------------- | -------------- | ------------------------------------------- |
| Användarprofil       | `USER#<userId>`       | `PROFILE`      | Lagra användaruppgifter och hashat lösenord |
| Meddelande           | `USER#<userId>`       | `MESSAGE#<id>` | Koppla ett meddelande till dess ägare       |
| E-postuppslag        | `EMAIL#<email>`       | `LOOKUP`       | Hitta användar-id via e-post                |
| Användarnamnsuppslag | `USERNAME#<username>` | `LOOKUP`       | Hitta användar-id via användarnamn          |

Användarprofilen och användarens meddelanden delar samma partitionsnyckel. Sorteringsnyckeln skiljer profilen från meddelandena och gör det möjligt att hämta bara meddelanden med prefixet `MESSAGE#`.

Uppslagsposterna innehåller användarens id. De gör att backend kan hitta rätt användare utan att söka igenom hela tabellen.

### Global Secondary Index: GSI1

Meddelandeposter har också följande indexnycklar:

| Nyckel   | Värde              |
| -------- | ------------------ |
| `GSI1PK` | `MESSAGES`         |
| `GSI1SK` | `<createdAt>#<id>` |

GSI1 används för att hämta meddelanden från alla användare i datumordning, med de nyaste först. Det behövs eftersom tabellens primärnyckel grupperar meddelanden per användare.

Endast meddelandeposter har dessa indexnycklar och ingår därför i indexet. GSI1 använder projektionen `ALL`, så alla attribut från meddelandeposterna finns tillgängliga där.

### Access patterns

Databasens nycklar är valda utifrån följande sätt att läsa och skriva data:

| Access pattern                     | Lösning                                                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skapa ett meddelande               | Hämta användarprofilen med `GetCommand` och skapa meddelandet med `PutCommand` under `USER#<userId>` / `MESSAGE#<id>`                                       |
| Hämta alla meddelanden             | `QueryCommand` mot GSI1 med `GSI1PK = MESSAGES`, i fallande datumordning                                                                                    |
| Hämta meddelanden via användarnamn | Hämta `USERNAME#<username>` / `LOOKUP` med `GetCommand`. Använd sedan dess `userId` i en `QueryCommand` med `PK = USER#<userId>` och SK-prefixet `MESSAGE#` |
| Hämta ett specifikt meddelande     | `GetCommand` med `USER#<userId>` / `MESSAGE#<id>`                                                                                                           |
| Redigera ett meddelande            | `UpdateCommand` med meddelandets PK och SK                                                                                                                  |
| Radera ett meddelande              | `DeleteCommand` med meddelandets PK och SK                                                                                                                  |
| Hämta användare via e-post         | Hämta `EMAIL#<email>` / `LOOKUP`, följt av användarprofilen, med två `GetCommand`                                                                           |
| Hämta användare via id             | `GetCommand` med `USER#<userId>` / `PROFILE`                                                                                                                |
| Registrera användare               | `TransactWriteCommand` skapar profil, e-postuppslag och användarnamnsuppslag tillsammans                                                                    |

Alla dessa access patterns löses med nyckelbaserade operationer. Ingen `Scan` används.

Vid registrering gör transaktionen att antingen alla tre poster skapas eller ingen. Villkor på skrivningarna hindrar att befintliga poster skrivs över och säkerställer unika användarnamn och e-postadresser.

Vid redigering och radering kontrollerar backend först att användar-id i sökvägen matchar den verifierade JWT:n. Databasoperationen kräver sedan att meddelandet finns.

[**Figmalänken**](https://www.figma.com/board/UGt5tJfNtpMP3f8Wefvbnx/Shui-access-patterns?node-id=0-1&p=f&t=fAOAwxGK3o2uwVI6-0)

[**Databasmodell för Shui**](docs/databasModell.png)
