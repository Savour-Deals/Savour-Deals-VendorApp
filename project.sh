#!/bin/bash
BUILD="$1"
TYPE="$2"

if [ "build" == "$BUILD" ]; then
	if [ "dev" == "$TYPE" ]; then
		ionic build
	elif [ "prod" == "$TYPE" ]; then
		cross-env ENV=’prod’ ionic build
	fi
elif [ "serve" == "$BUILD" ]; then
	if [ "dev" == "$TYPE" ]; then
		ionic serve
	elif [ "prod" == "$TYPE" ]; then
		cross-env ENV=’prod’ ionic serve
	fi
elif [ "deploy" == "$BUILD" ]; then
	if [ "dev" == "$TYPE" ]; then
		ionic build
		firebase use default
		firebase deploy
	elif [ "prod" == "$TYPE" ]; then
		cross-env ENV=’prod’ ionic build
		firebase use savourprod
		firebase deploy
	fi
fi