#!/bin/bash
set -e

echo "Building Verification Lambda..."
dotnet restore
dotnet lambda package -c Release -o bin/Release/net10.0/VerificationLambda.zip

echo "Build complete!"
