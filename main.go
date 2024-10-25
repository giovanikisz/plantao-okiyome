package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Membro struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Nome      string             `json:"nome"`
	Dojo      string             `json:"dojo"`
	Categoria string             `json:"categoria"`
	Okiyomes  int                `json:"okiyomes"`
	Pontos    int                `json:"pontos"`
	Acai      int                `json:"acai"`
}

type RegistaOkiyome struct {
	ID       string `json:"id"`
	Okiyomes int    `json:"okiyomes"`
	Pontos   int    `json:"pontos"`
}

var collection *mongo.Collection

func main() {
	fmt.Println("Hello worlds ")

	if os.Getenv("ENV") != "production" {
		// Load the .env file if not in production
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file:", err)
		}
	}

	MONGODB_URI := os.Getenv(("MONGODB_URI"))
	DATABASE := os.Getenv(("DATABASE"))
	COLLECTION := os.Getenv(("COLLECTION"))
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal((err))
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal((err))
	}
	fmt.Println("Connected to MONGODB ATLAS")

	collection = client.Database(DATABASE).Collection(COLLECTION)

	app := fiber.New()

	// app.Use(cors.New(cors.Config{
	// 	AllowOrigins: "http://localhost:3000",
	// 	AllowHeaders: "Origin,Content-Type,Accept",
	// }))

	PORT := os.Getenv("PORT")

	// app.Get("/api/membro/:id", getMembro)
	app.Get("/api/membros", getMembros)
	app.Post("api/register", createMembro)
	app.Put("/api/okiyome/:id", updateMembro)

	log.Fatal(app.Listen(":" + PORT))
}

func getPontos(id primitive.ObjectID) (int, error) {
	var membro Membro
	err := collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&membro)
	if err != nil {
		return membro.Pontos, err
	}

	return membro.Pontos, nil
}

func getMembros(c *fiber.Ctx) error {
	var membros []Membro
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var membro Membro
		if err := cursor.Decode(&membro); err != nil {
			return err
		}

		membros = append(membros, membro)
	}

	return c.JSON(membros)
}

func createMembro(c *fiber.Ctx) error {
	membro := new(Membro)
	if err := c.BodyParser(membro); err != nil {
		return err
	}

	insertResult, err := collection.InsertOne(context.Background(), membro)
	if err != nil {
		return err
	}

	membro.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(membro)
}

func updateMembro(c *fiber.Ctx) error {
	var registaOkiyome RegistaOkiyome
	okiyome := 1
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	pontosAtual, err := getPontos(objectID)

	if err != nil {
		return err
	}

	if err := c.BodyParser(&registaOkiyome); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	filter := bson.M{"_id": objectID}
	if registaOkiyome.Okiyomes == 14 {
		okiyome = 0
	}
	pontosAtualizado := pontosAtual + registaOkiyome.Pontos
	novoAcai := pontosAtualizado / 15
	update := bson.M{
		"$inc": bson.M{"okiyomes": okiyome, "pontos": registaOkiyome.Pontos},
		"$set": bson.M{"acai": novoAcai},
	}

	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if result.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Document not found"})
	}

	return c.Status(200).JSON(registaOkiyome)
}
