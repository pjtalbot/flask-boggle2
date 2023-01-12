from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setup(self):
        """Runs before every test"""

        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_homepage(self):
        """Homepage renders in HTML and DOM"""

        with self.cleint:
            response = self.client.get('/')
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))


    # TODO -- write tests for every view function / feature!

