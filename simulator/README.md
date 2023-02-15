# FullCycle-12-Simulator

<p>Nessa pasta, estão os docker-compose tanto para o simulador em go, como para o Kafka.</p>
<a href="https://github.com/victorehrich/FullCycle-12/tree/master/simulator/.docker/kafka/README.md">link para o README.md do kafka</a>
<p>*dentro dos docker-compose, será necessário configurar com o seu IP do WSL2</p>
<p></p>
<h3>Comandos:</h3>

<p>Dentro da pasta simulator, em um terminal, digite para iniciar o container do simulador em go:</p>

```
docker-compose up -d
```
<p>para abrir o bash dele, no terminal, digite:</p>

```
docker exec -it simulator bash
```
<p>Por fim, para caso deseje, rode a main, usando</p>

```
go run main.go
```