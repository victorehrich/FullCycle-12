# FullCycle-12-Kafka

<p>*dentro dos docker-compose, será necessário configurar com o seu IP do WSL2</p>
<p></p>
<h3>Comandos:</h3>

<p>Dentro da pasta .docker/kafka, em um terminal, digite para iniciar os containers do kafka:</p>

```
docker-compose up -d
```
<p>*confira se o container kafka-1 está rodando antes do próximo passo</p>
<p>para abrir o bash dele, no terminal, digite:</p>

```
docker exec -it kafka-kafka-1 bash
```
<p>Por fim, rode o comando para ficar mostrando as mensagem no terminal (não necessário para o funcionamento da aplicação)</p>

```
kafka-console-consumer --bootstrap-server=localhost:9094 --topic=route.new-position
```