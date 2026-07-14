import { NetworkLogPreset } from './types';

export const NETWORK_LOG_PRESETS: NetworkLogPreset[] = [
  {
    id: 'sql-injection',
    title: 'SQL Injection on Web App',
    alertType: 'Web Application Attack - SQL Injection',
    severity: 'Critical',
    description: 'An external attacker trying to extract credentials from the database via SQL injection.',
    rawLog: `[2026-07-13 22:15:32] IDS ALERT: [1:200045:3] GPL SQL Injection attempt
Source IP: 45.227.254.12 -> Target IP: 192.168.1.15
Protocol: TCP | Source Port: 49211 | Target Port: 80 (HTTP)
RAW PACKET HEADER:
54 43 50 20 73 72 63 3a 20 34 35 2e 32 32 37 2e
RAW HTTP PAYLOAD:
GET /api/v1/users/login?user=admin'%20UNION%20SELECT%20null,username,password%20FROM%20users--%20HTTP/1.1
Host: secure-portal.local
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0)
Accept: */*
X-Forwarded-For: 45.227.254.12`
  },
  {
    id: 'ssh-brute-force',
    title: 'SSH Brute Force Attempt',
    alertType: 'Authentication Failure - SSH Brute Force',
    severity: 'High',
    description: 'High frequency of SSH authentication failures indicating an active credential stuffing attack.',
    rawLog: `[2026-07-13 22:18:01] auth.log: sshd[14829]: Failed password for root from 185.56.80.22 port 51102 ssh2
[2026-07-13 22:18:02] auth.log: sshd[14831]: Failed password for root from 185.56.80.22 port 51106 ssh2
[2026-07-13 22:18:03] auth.log: sshd[14835]: Failed password for root from 185.56.80.22 port 51110 ssh2
[2026-07-13 22:18:04] auth.log: sshd[14840]: Failed password for admin from 185.56.80.22 port 51114 ssh2
[2026-07-13 22:18:05] auth.log: sshd[14842]: Failed password for support from 185.56.80.22 port 51120 ssh2
Source IP: 185.56.80.22 -> Target IP: 10.0.0.45
Protocol: TCP | Target Port: 22 (SSH)`
  },
  {
    id: 'simulated-nmap-scan',
    title: 'Simulated Nmap Port Scan',
    alertType: 'Simulated Reconnaissance - Port Scanning',
    severity: 'Medium',
    description: 'A network scan simulating a vulnerability audit or pre-attack reconnaissance.',
    rawLog: `[2026-07-13 22:20:10] IDS ALERT [1:200109:4] Simulated Host Scan Attempt
Source IP: 192.168.50.99 -> Target IP: 192.168.50.10
Protocol: TCP SYN
Flags: [S] Seq=4192031 Win=1024
Target Ports probe sequence:
192.168.50.99:43212 -> 192.168.50.10:21 (FTP) - CLOSED/RST
192.168.50.99:43213 -> 192.168.50.10:22 (SSH) - OPEN
192.168.50.99:43214 -> 192.168.50.10:80 (HTTP) - OPEN
192.168.50.99:43215 -> 192.168.50.10:443 (HTTPS) - OPEN
192.168.50.99:43216 -> 192.168.50.10:3389 (RDP) - CLOSED/RST
Note: Initiated from Internal Security Audit workstation.`
  },
  {
    id: 'c2-beaconing',
    title: 'Malware Command & Control (C2) Beaconing',
    alertType: 'Malware Activity - Command & Control Beaconing',
    severity: 'Critical',
    description: 'Internal endpoint exhibiting persistent periodic beaconing behaviour to a known malicious C2 IP.',
    rawLog: `[2026-07-13 22:11:00] FIREWALL ALERT: Outbound connection matching threat feed reputation IP list
Source IP: 10.10.12.84 -> Target IP: 82.102.23.4
Protocol: HTTPS (TCP) | Source Port: 58491 | Target Port: 443
Log history of outbound synchronization:
22:01:00 - Outbound connection to 82.102.23.4 (443) - 1.2 KB transferred
22:06:00 - Outbound connection to 82.102.23.4 (443) - 1.2 KB transferred
22:11:00 - Outbound connection to 82.102.23.4 (443) - 1.2 KB transferred
Periodic heartbeat matches "Cobalt Strike / Beacon" pattern (jitter 0%).`
  },
  {
    id: 'ransomware-movement',
    title: 'Ransomware Lateral Movement',
    alertType: 'Intrusion - Local Ransomware Propagation',
    severity: 'Critical',
    description: 'An infected internal computer attempting to locate and encrypt network folder shares.',
    rawLog: `[2026-07-13 22:25:40] IDS ALERT: SMB SMB2_COM_SESSION_SETUP unauthorized access attempt
Source IP: 10.1.4.12 -> Target IP: 10.1.4.2 (Main-FileShare)
Source IP: 10.1.4.12 -> Target IP: 10.1.4.3 (HR-Database)
Source IP: 10.1.4.12 -> Target IP: 10.1.4.4 (Backup-Vault-01)
Protocol: TCP | Target Port: 445 (SMB)
High frequency IPC$ connection requests with administrative usernames (admin, administrator, backup).
Over 400 file system metadata queries observed in 5 seconds.`
  }
];
