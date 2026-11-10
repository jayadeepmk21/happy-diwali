"""Validate SEO, Robots, Sitemap, and Schema for Happy Diwali 3D Simulator.
Usage: python scripts/check-seo.py [origin]
"""
import sys
import json
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

origin = (sys.argv[1] if len(sys.argv) > 1 else 'https://happydiwali.devs.surf').rstrip('/')

def get(path):
    url = origin + path
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Googlebot/2.1'})
    with urllib.request.urlopen(req, timeout=15) as res:
        assert res.status == 200, f"HTTP {res.status} for {url}"
        return res.read().decode('utf-8')

print(f"Testing live deployment: {origin}...")

# 1. Check Homepage
html = get('/')
class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.canonical = None
        self.in_json = False
        self.json_data = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta':
            k = a.get('name') or a.get('property')
            if k:
                self.meta[k] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical = a.get('href')
        if tag == 'script' and a.get('type') == 'application/ld+json':
            self.in_json = True
    def handle_endtag(self, tag):
        if tag == 'script':
            self.in_json = False
    def handle_data(self, data):
        if self.in_json and data.strip():
            self.json_data.append(json.loads(data))

parser = HeadParser()
parser.feed(html)

assert parser.canonical == f"{origin}/", f"Canonical mismatch: {parser.canonical}"
assert 'svHRYmtbglpiH3tbRNtCfqyDxKOuaOJNh3eaZp3Xkj4' in html, "GSC verification meta tag missing!"
assert parser.meta.get('robots') == 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
assert parser.meta.get('og:image') == f"{origin}/assets/images/og-preview.jpg"
print("PASS: Homepage HTML, Canonical, GSC Meta, and OpenGraph tags")

# 2. Check Robots.txt
robots = get('/robots.txt')
assert 'User-agent: *' in robots and 'Allow: /' in robots
assert f"Sitemap: {origin}/sitemap.xml" in robots
print("PASS: robots.txt structure and sitemap declaration")

# 3. Check Sitemap.xml
sitemap_xml = get('/sitemap.xml')
root = ET.fromstring(sitemap_xml)
locs = [el.text.rstrip('/') for el in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert origin in locs, f"Origin {origin} not found in sitemap"
print(f"PASS: sitemap.xml parsed successfully with {len(locs)} URLs: {locs}")

print("ALL SEO CHECKS PASSED SUCCESSFULLY!")
