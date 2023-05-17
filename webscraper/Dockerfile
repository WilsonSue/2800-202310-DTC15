# Use Python 3.9 image
FROM python:3.9

# Set the build arguments
ARG CONNECTION_STRING
ARG MONGODB_DATABASE

# Set the environment variables at runtime
ENV CONNECTION_STRING=$CONNECTION_STRING
ENV MONGODB_DATABASE=$MONGODB_DATABASE

# Copy the requirements file
COPY requirements.txt /webscraper/requirements.txt

# Install Python dependencies
WORKDIR /webscraper
RUN pip install --no-cache-dir -r requirements.txt

# Copy the script
COPY main.py /webscraper/main.py

# Set the command to run the script
CMD ["python", "main.py"]