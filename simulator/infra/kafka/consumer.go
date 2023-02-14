package kafka

import (
	"fmt"
	"log"
	"os"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type KafkaConsumer struct {
	MsgChan chan *ckafka.Message
}

func NewConsumer(msgChan chan *ckafka.Message) *KafkaConsumer {
	return &KafkaConsumer{
		MsgChan: msgChan,
	}
}

func (k *KafkaConsumer) Consume() {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KafkaBootstrapServers"),
		"group.id":          os.Getenv("kafkaConsumerGroupId"),
	}

	c, err := ckafka.NewConsumer(configMap)

	if err != nil {
		log.Fatalf("error consuming kafka message:" + err.Error())
	}

	topics := []string{os.Getenv("KafkaConsumeTopics")}

	c.SubscribeTopics(topics, nil)
	fmt.Println("kafka consumer has been started")

	for {
		msg, err := c.ReadMessage(-1)
		if err == nil {
			k.MsgChan <- msg
		}
	}
}
