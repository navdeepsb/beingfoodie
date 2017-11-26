#!/usr/bin/env python

import os
import webapp2
import jinja2


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + "/templates"),
    extensions=["jinja2.ext.autoescape"],
    autoescape=True)

# This object will be sent to every template:
omni = {
    "paths": {
        "static": "/static"
    }
}

class MainHandler(webapp2.RequestHandler):
    def get(self):
        responseParams = {
            # Add more attributes here
            # ...
        }

        omni.update(responseParams)
        temp = JINJA_ENVIRONMENT.get_template("index.html").render(omni)

        self.response.write(temp)

class AboutHandler(webapp2.RequestHandler):
    def get(self):
        title = "about"
        template_vars = {
            'title': title
        }
        template = JINJA_ENVIRONMENT.get_template('about.html')
        self.response.out.write(template.render(template_vars))

class ContactHandler(webapp2.RequestHandler):
    def get(self):
        title = "contact"
        template_vars = {
            'title': title
        }
        template = JINJA_ENVIRONMENT.get_template('contact.html')
        self.response.out.write(template.render(template_vars))

class ProfileHandler(webapp2.RequestHandler):
    def get(self):
        title = "profile"
        template_vars = {
            'title': title
        }
        template = JINJA_ENVIRONMENT.get_template('profile.html')
        self.response.out.write(template.render(template_vars))

app = webapp2.WSGIApplication([
    ("/", MainHandler),
    ("/about", AboutHandler),
    ("/contact", ContactHandler),
    ("/profile", ProfileHandler),
], debug=True)
