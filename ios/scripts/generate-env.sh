#!/bin/bash

# Path to the .env file
ENV_FILE="../../.env"

# Path to the output file
OUTPUT_FILE="../tmp.xcconfig"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found"
    exit 1
fi

# Create or clear the output file
echo "" > "$OUTPUT_FILE"

# Read the .env file and create xcconfig entries
while IFS='=' read -r key value
do
    # Skip empty lines and comments
    if [[ -z "$key" || "$key" =~ ^# ]]; then
        continue
    fi
    
    # Remove any quotes from the value
    value=$(echo "$value" | tr -d '"' | tr -d "'")
    
    # Write to the output file
    echo "$key = $value" >> "$OUTPUT_FILE"
done < "$ENV_FILE"

echo "Generated $OUTPUT_FILE successfully" 