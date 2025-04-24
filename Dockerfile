# Start from the bretfisher/jekyll-serve image
FROM bretfisher/jekyll-serve:latest

# Set the working directory in the container
WORKDIR /site

# Install dependencies if a Gemfile exists
# This will ensure that gems are installed only once during build
COPY Gemfile* ./
RUN bundle install

# Copy the rest of your Jekyll project to the container
COPY . ./

# Expose port 4000 for Jekyll to serve the site
# EXPOSE 4000

# Start Jekyll
# CMD ["jekyll", "serve", "--host", "0.0.0.0"]

