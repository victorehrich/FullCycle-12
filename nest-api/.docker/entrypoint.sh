#!/bin/bash

npm install

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

npm run start:dev