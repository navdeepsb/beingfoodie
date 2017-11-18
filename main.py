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
        self.response.write( JINJA_ENVIRONMENT.get_template("index.html").render(omni) )

app = webapp2.WSGIApplication([
    ("/", MainHandler)
], debug=True)
