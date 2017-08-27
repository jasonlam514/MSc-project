import os, sys

		
properties = []
#Print the property list with number
with open('driver.pctl', 'r') as pfile:
	for pline in pfile:
		if pline != '\n' and pline[0]!= '/':
			properties.append(pline)
			
for i,a in enumerate(properties):
	print('%d: %s' % (i+1,a))