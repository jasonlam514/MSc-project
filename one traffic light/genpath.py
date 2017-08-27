# ctrl+k block comment
initial = "0"
row = 0
road_length = 170

import os, sys
import random
import time

infile = open("adv.tra" , "r")
file_reward = open("out1.srew" , "r")
file_state = open("out.sta" , "r")
wfile = open('adv.txt',"w")

d = {'key':'list'}
st = {'key':'value'}
rand = {'key':'value'}
list = []

def search(state,wfile):
	print('get: '+state)
	if state in list:
		global temps
		temps = temps + st[state] + '\n'
		print('reward: '+ state);
	if state in d:
		search(d[state],wfile)
	return

#Read reward file
#The last state in each cycle is given a reward of 1(car position is the same in each cycle), only these states are shown in the output trace and displayed by simulator
def read_rewardfile():
	for line in file_reward:
		lline = line.split()
		list.append(int(lline[0]))

#Obtain part of state information
#Read states file
def get_state_info():
	for line in file_state:
		linee = line.split(':')
		if len(linee) > 1:
			st[int(linee[0])] = linee[1].replace('(','[').replace(')',']').replace('\n','')+','
		else:
			tup = linee[0].split(',')
			tup[0] = tup[0][1:]
			tup[len(tup)-1] = tup[len(tup)-1][:-2]
			vars = '['
			for i in tup:
				#print(i)
				vars = vars + '\'' + i + '\','
			vars = vars[:-1] + ']'
	return vars
			#tup = linee[1].split(',')
			#tup[0] = tup[0][1:]
			#tup[30] = tup[30][:1]
			#tup[0]=car_pos, tup[13]=near_dist, tup[14]=far_dist, tup[15-20]=memory,distance1-memory,distance3, tup[23]=decision, tup[25]=velocity, tup[27]=assist_acc, tup[28]=light_signal
			#st[int(linee[0])] = '['+tup[0]+','+tup[13]+','+tup[14]+','+tup[15]+','+tup[16]+','+tup[17]+','+tup[18]+','+tup[19]+','+tup[20]+','+tup[23]+','+tup[25]+','+tup[27]+','+tup[28]+'],'

#Map the possible states to the previous state
def adv_map_states():
	line = infile.readline()
	while line: 
		lline = line.split();
		if lline[0] != lline[1] and len(lline) > 2:
			if float(lline[2]) < 1:
				tlist = []
				rand = {'key':'value'}
				tlist.append(int(lline[1]))
				rand[int(lline[1])] = float(lline[2])
				last_pos = infile.tell()
				nline = infile.readline().split()
				while nline[0] == lline[0]:
					tlist.append(int(nline[1]))
					rand[int(nline[1])] = float(nline[2])
					last_pos = infile.tell()
					nline = infile.readline().split()
				pos = []
				for ele in tlist:
					pos = pos + [ele] * int(float(rand[ele]) * 10)
				d[int(lline[0])] = pos
				infile.seek(last_pos)				
			else:
				d[int(lline[0])] = [int(lline[1])]
				
		line = infile.readline()
				
	infile.seek(0) 
	
#Map the possible states to the previous state
def tran_map_states():
	with open('out.tra', 'r') as tfile:
		line = tfile.readline()
		while line: 
			lline = line.split();
			if lline[0] != lline[2] and len(lline) > 3:
				#if float(lline[3]) < 1:
				tlist = []
				rand = {'key':'value'}
				tlist.append(int(lline[2]))
				rand[int(lline[2])] = float(lline[3])
				last_pos = tfile.tell()
				nline = tfile.readline().split()
				if len(nline) > 0:
					while nline[0] == lline[0]:
						tlist.append(int(nline[2]))
						rand[int(nline[2])] = float(nline[3])
						last_pos = tfile.tell()
						nline = tfile.readline().split()
						if len(nline) == 0:
							break
				pos = []
				for ele in tlist:
					pos = pos + [ele] * int(float(rand[ele]) * 10)
				d[int(lline[0])] = pos
				tfile.seek(last_pos)				
					
			line = tfile.readline()
				
	tfile.close() 
	
def output(chosen_state,list,temps):
	print('state in trace: '+str(chosen_state))
	if chosen_state in list:
		print('last state in the current cycle: '+ str(chosen_state))
	temps = temps + st[chosen_state] + '\n'
	properties = []
	#Extract property with property number given
	with open('driver.pctl', 'r') as pfile:
		for pline in pfile:
			if pline != '\n' and pline[0]!= '/':
				properties.append(pline)						
	#Write property, probability and path to generate the javascript file
	filenames = ['javascript1.txt', 'javascript2.txt']				
	with open('traffic//js/index.js', 'w') as outfile:
		if os.path.isfile('./res.txt'):
			with open('res.txt', 'r') as rfile:
				outfile.write('var result = '+rfile.readlines()[1][:-1]+';\n')
			rfile.close()
		else:
			outfile.write('var result = \'unknown\';\n')
		prop = ''
		ini = ''
		near = ''
		far = ''
		assist = ''
		if len(sys.argv) > 1 and properties[int(sys.argv[1])-1]:
			prop = properties[int(sys.argv[1])-1][:-1]
			ini = sys.argv[2]
			near = sys.argv[3]
			far = sys.argv[4]
			assist = sys.argv[5]
			with open('param.txt', 'w') as pfile:
				pfile.write(properties[int(sys.argv[1])-1])
				pfile.write(sys.argv[2]+'\n')
				pfile.write(sys.argv[3]+'\n')
				pfile.write(sys.argv[4]+'\n')
				pfile.write(sys.argv[5]+'\n')								
			pfile.close()
		else:
			if os.path.isfile('./param.txt'):
				with open('param.txt', 'r') as pfile:
					param = pfile.readlines()
					prop = param[0][:-1]
					ini = param[1][:-1]
					near = param[2][:-1]
					far = param[3][:-1]
					assist = param[4][:-1]
				pfile.close()
			else:
				prop = 'Property not specified'
				ini = '\'\''
				near = '\'\''
				far = '\'\''
				assist = '\'\''
		outfile.write('var ini = '+ini+';\n')
		outfile.write('var near = '+near+';\n')
		outfile.write('var far = '+far+';\n')
		outfile.write('var assist = '+assist+';\n')	
		outfile.write('var prop = \''+prop+'\';\n')
		outfile.write('var vars = '+vars+';\n')		
		outfile.write('var data = [\n'+temps[:-2]+'\n];\n')
		outfile.write('var violation = '+str(violation)+';\n')
		with open(filenames[0]) as in2file:
			outfile.write(in2file.read())
	outfile.close()
	wfile.write('\nThe output trace:\n'+vars+'\n')
	wfile.write(temps[:-2])
	wfile.close()
	
try:
	read_rewardfile()
	vars = get_state_info()	
	adv_map_states()
	
	#Extract the trace
	#Read from adversaries file and transition state map
	global temps
	temps = ''
	violation = 'false'
	chosen_state = -1
	wfile.write('A random transition map picked from adversaries:\n')
	gen = False
	start_time = time.time()
	for line in infile: 	
		lline = line.split()
		if lline[0] == initial:
			gen = True
			while int(lline[0]) in d:
				print('state in trace: '+str(lline[0]))
				#Pick last state in a cycle
				if int(lline[0]) in list:
					temps = temps + st[int(lline[0])] + '\n'
					print('last state in the current cycle: '+ str(lline[0]));
				#Pick the resulting state randomly in each transition containing several resulting states having probability <1
				if len(d[int(lline[0])]) > 1:
					chosen_state = random.choice(d[int(lline[0])])
				else:
					chosen_state = d[int(lline[0])][0]
				wfile.write(str(lline[0])+':'+str(chosen_state)+'\n')
				lline[0] = chosen_state
				if (time.time() - start_time) > 10:
					print('possibly loop')
					break
			
			if st[chosen_state][1:4] != str(road_length):
				wfile.write('Trace will be continually generated from all possible transitions\n')
				violation = 'true'
				tran_map_states()
				start_time = time.time()
				print('************************************************')
				while int(lline[0]) in d:
					print('state in trace: '+str(lline[0]))
					#Pick last state in a cycle
					if int(lline[0]) in list:
						temps = temps + st[int(lline[0])] + '\n'
						print('last state in the current cycle: '+ str(lline[0]));
					#Pick the resulting state randomly in each transition containing several resulting states having probability <1
					if len(d[int(lline[0])]) > 1:
						chosen_state = random.choice(d[int(lline[0])])
					else:
						chosen_state = d[int(lline[0])][0]
					if chosen_state in list:
						wfile.write(str(lline[0])+':'+str(chosen_state)+'*\n')
					else:
						wfile.write(str(lline[0])+':'+str(chosen_state)+'\n')
					lline[0] = chosen_state
					if (time.time() - start_time) > 10:
						print('possibly loop')
						break
			output(chosen_state,list,temps)
			break
	if gen == False:
		with open('out.tra', 'r') as tfile:
			tran_map_states()
			violation = 'true'
			for line in tfile: 	
				lline = line.split()
				if lline[0] == initial:
					start_time = time.time()
					print('************************************************')
					while int(lline[0]) in d:
						print('state in trace: '+str(lline[0]))
						#Pick last state in a cycle
						if int(lline[0]) in list:
							temps = temps + st[int(lline[0])] + '\n'
							print('last state in the current cycle: '+ str(lline[0]));
						#Pick the resulting state randomly in each transition containing several resulting states having probability <1
						if len(d[int(lline[0])]) > 1:
							chosen_state = random.choice(d[int(lline[0])])
						else:
							chosen_state = d[int(lline[0])][0]
						wfile.write(str(lline[0])+':'+str(chosen_state)+'\n')
						lline[0] = chosen_state
						if (time.time() - start_time) > 10:
							print('possibly loop')
							break
					output(chosen_state,list,temps)
					break

finally:
	infile.close()
	file_reward.close()
	file_state.close()

