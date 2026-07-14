export interface MockReport {
  id: string;
  alertType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  report: string;
}

// 5 pre-defined professional security reports corresponding exactly to our 5 incident scenarios
export const MOCK_REPORTS: Record<string, string> = {
  'sql-injection': `🚨 1. INCIDENT DESCRIPTION (What happened?):
- An external attacker is actively attempting to exploit a SQL Injection (SQLi) vulnerability on the primary web application portal (secure-portal.local). The attacker is trying to bypass authentication controls and extract sensitive table contents (such as usernames and passwords) from the back-end database.
- Severity Level: **Critical**. If left unmitigated, this threat could lead to complete database exposure, unauthorized administrative access, privilege escalation, and severe data leakage.

🔍 2. TECHNICAL ANALYSIS (Details):
- **Attacker Source**: 45.227.254.12
- **Target Server**: 192.168.1.15
- **Protocol & Port**: TCP / Port 80 (HTTP)
- **Active Service**: Web Server (Nginx/Apache reverse proxy routing to secure-portal.local)
- **Technical Analysis of Payload**:
  - The malicious GET request targets \`/api/v1/users/login?user=admin'%20UNION%20SELECT%20null,username,password%20FROM%20users--\`
  - The URL payload contains standard SQL Injection signatures, specifically utilizing the \`' UNION SELECT\` technique to join query results from the \`users\` table, accompanied by \`--\` comment indicators to nullify the rest of the legitimate application query.

🛡️ 3. URGENT ACTIONS (What should the administrator do?):
1. **Immediate Network Blocking**: Apply a firewall rule to drop all incoming traffic from the rogue IP \`45.227.254.12\` immediately at the network edge or perimeter firewall.
2. **Web Application Firewall (WAF) Rule**: Enable or deploy custom WAF rules to detect and reject incoming requests containing SQL syntax words (e.g., \`UNION\`, \`SELECT\`, \`--\`).
3. **Parameterize Database Queries**: Ensure that the backend login handler uses parameterized queries or Object-Relational Mapping (ORM) to sanitize incoming user inputs, neutralizing any nested SQL syntax.`,

  'ssh-brute-force': `🚨 1. INCIDENT DESCRIPTION (What happened?):
- An external attacker is executing a high-frequency credential stuffing / dictionary attack targeting the server's SSH management port. This indicates an active attempt to guess legitimate administrative login credentials (such as root, admin, and support).
- Severity Level: **High**. If successful, this attack would grant the threat actor direct root terminal access to the system, enabling them to execute malicious payloads, install backdoors, or pivot laterally.

🔍 2. TECHNICAL ANALYSIS (Details):
- **Attacker Source**: 185.56.80.22
- **Target Server**: 10.0.0.45
- **Protocol & Port**: TCP / Port 22 (SSH)
- **Active Service**: Secure Shell Daemon (sshd)
- **Technical Analysis of Payload**:
  - The technical log snippet displays multiple failed SSH authentication attempts within a fraction of a second from source IP \`185.56.80.22\` utilizing common system usernames.
  - The high frequency and sequential nature of ports (\`51102\`, \`51106\`, \`51110\`, etc.) are characteristic of automated password guessing tools (such as Hydra or Medusa).

🛡️ 3. URGENT ACTIONS (What should the administrator do?):
1. **Perimeter IP Firewall Block**: Immediately deploy a firewall rule to ban and block the malicious source IP \`185.56.80.22\` from connecting to port 22.
2. **Deploy Fail2ban / SSH Guard**: Set up or configure a service like \`fail2ban\` to automatically ban IP addresses that exceed 3 or 5 failed SSH authentication attempts within a 10-minute window.
3. **Implement Key-Based Authentication**: Disable standard password authentication in \`/etc/ssh/sshd_config\` (\`PasswordAuthentication no\`) and enforce SSH key-based authentication for all users.`,

  'simulated-nmap-scan': `🚨 1. INCIDENT DESCRIPTION (What happened?):
- A network reconnaissance probe (TCP SYN port scan) has been detected within the internal network. The scan is probing critical server ports to map active services and uncover potential vulnerabilities.
- Severity Level: **Medium** (Simulated Security Drill). The log indicates this scan was initiated from an Internal Security Audit workstation, meaning it is a controlled test. However, in a real scenario, this is the precursor to a targeted attack.

🔍 2. TECHNICAL ANALYSIS (Details):
- **Attacker Source**: 192.168.50.99 (Internal Security Audit Workstation)
- **Target Server**: 192.168.50.10
- **Protocol**: TCP SYN Port Scan
- **Active Ports Probed**:
  - Port 21 (FTP): CLOSED
  - Port 22 (SSH): OPEN
  - Port 80 (HTTP): OPEN
  - Port 443 (HTTPS): OPEN
  - Port 3389 (RDP): CLOSED
- **Technical Analysis of Payload**:
  - The source IP sequentially connected to multiple destination ports using the half-open SYN scanning technique (which leaves connections uncompleted to avoid standard application layer log generation).

🛡️ 3. URGENT ACTIONS (What should the administrator do?):
1. **Confirm Scan Authorization**: Verify with the security team that the internal IP \`192.168.50.99\` was conducting an authorized internal network vulnerability audit.
2. **Disable Unused Protocols**: Ensure that non-essential open services (like unencrypted HTTP on port 80) are disabled or redirected securely to port 443.
3. **Implement Port Knocking / Network Segregation**: Place management ports (like SSH 22) behind a secure VPN gateway or configure host-based firewalls to only accept connections from specific administration subnets.`,

  'c2-beaconing': `🚨 1. INCIDENT DESCRIPTION (What happened?):
- An internal endpoint is exhibiting persistent, periodic outbound connections to a known external malicious Command & Control (C2) server. This heartbeat beaconing behavior is highly indicative of a compromised local device operating under a remote malware infrastructure.
- Severity Level: **Critical**. If unmitigated, the threat actors will have a persistent backdoor to execute arbitrary shell commands, exfiltrate confidential company databases, or download secondary destructive payloads like ransomware.

🔍 2. TECHNICAL ANALYSIS (Details):
- **Attacker Target (C2 Server)**: 82.102.23.4
- **Compromised Local Host**: 10.10.12.84
- **Protocol & Port**: HTTPS (TCP) / Port 443
- **Technical Analysis of Payload**:
  - Outbound synchronization occurs exactly every 5 minutes (300 seconds) with an exact jitter of 0% transferring a uniform data packet size of 1.2 KB.
  - This rigid, automatic timing pattern perfectly matches C2 framework agent beacon signatures (such as Cobalt Strike, Metasploit, or Brute Ratel) rather than typical human browser browsing behavior.

🛡️ 3. URGENT ACTIONS (What should the administrator do?):
1. **Isolate Compromised Host**: Immediately isolate the local infected machine \`10.10.12.84\` from the active local network subnet (disconnect the ethernet or disable its Wi-Fi access) to prevent lateral pivoting.
2. **Block C2 Infrastructure**: Add an immediate, permanent egress block rule on the enterprise perimeter firewall and proxy servers to drop all outbound requests directed to the C2 IP \`82.102.23.4\`.
3. **Conduct Deep Malware Scan**: Run a comprehensive host-based EDR (Endpoint Detection and Response) scanner on the compromised machine to identify, terminate, and remove the malicious persistence mechanism or Trojan file.`,

  'ransomware-movement': `🚨 1. INCIDENT DESCRIPTION (What happened?):
- A compromised internal workstation is attempting rapid, unauthorized lateral propagation and network share connections across internal servers via the Server Message Block (SMB) protocol. This behavior indicates an active, fast-moving Ransomware infection searching for critical files to encrypt.
- Severity Level: **Critical**. Left unaddressed, ransomware can spread and encrypt core fileshares, active databases, and backups within minutes, halting all business operations.

🔍 2. TECHNICAL ANALYSIS (Details):
- **Compromised Source Host**: 10.1.4.12
- **Targets Scanned/Accessed**:
  - \`10.1.4.2\` (Main-FileShare)
  - \`10.1.4.3\` (HR-Database)
  - \`10.1.4.4\` (Backup-Vault-01)
- **Protocol & Port**: TCP / Port 445 (SMB)
- **Technical Analysis of Payload**:
  - The compromised machine is sending high-frequency IPC$ connection requests using administrative account credentials (\`admin\`, \`administrator\`, \`backup\`).
  - It initiated over 400 filesystem metadata query operations in just 5 seconds, a signature characteristic of ransomware automated directory traversal scanners preparing for file encryption.

🛡️ 3. URGENT ACTIONS (What should the administrator do?):
1. **Immediate Host Isolation**: Instantly isolate the local machine \`10.1.4.12\` from the network. If remote management is unavailable, shut down the device immediately to stop encryption processes.
2. **Disable SMBv1 & Restrict Port 445**: Ensure that SMBv1 is disabled completely across the environment and restrict Port 445 traffic between workstations, limiting fileshare access strictly to authorized domain servers.
3. **Revoke and Reset Compromised Admin Accounts**: Immediately revoke and reset passwords for the administrative accounts (\`admin\`, \`administrator\`, \`backup\`) used in the login attempts, and audit the backups on \`10.1.4.4\` to ensure they are clean, offline, or immutably protected.`
};

/**
 * Extracts metadata from log content.
 */
function extractMetadata(rawLog: string) {
  const srcIpMatch = rawLog.match(/(?:Source IP|SRC|Source|src):\s*([0-9a-fA-F.:]+)/i) || rawLog.match(/from\s+([0-9a-fA-F.:]+)/i);
  const dstIpMatch = rawLog.match(/(?:Target IP|DST|Target|dst):\s*([0-9a-fA-F.:]+)/i) || rawLog.match(/to\s+([0-9a-fA-F.:]+)/i);
  const portMatch = rawLog.match(/(?:Target Port|Port|port):\s*(\d+)/i) || rawLog.match(/:(\d+)/i);
  const protoMatch = rawLog.match(/(?:Protocol|Proto):\s*(\w+)/i) || (rawLog.toLowerCase().includes("tcp") ? ["", "TCP"] : rawLog.toLowerCase().includes("udp") ? ["", "UDP"] : ["", "TCP"]);

  return {
    sourceIp: srcIpMatch ? srcIpMatch[1] : "INFECTED_DEVICE",
    targetIp: dstIpMatch ? dstIpMatch[1] : "INTERNAL_SERVER",
    port: portMatch ? portMatch[1] : "80",
    protocol: protoMatch ? protoMatch[1].toUpperCase() : "TCP"
  };
}

/**
 * Generates a dynamic, highly realistic template-based security report
 * based on selected severity and log contents.
 */
export function generateDynamicReport(alertType: string, rawLog: string, severity: 'Critical' | 'High' | 'Medium' | 'Low'): string {
  const meta = extractMetadata(rawLog);

  let consequence = '';
  let dangerDetails = '';
  let mitigationList = '';

  switch (severity) {
    case 'Critical':
      consequence = `Immediate exposure of critical databases, infrastructure shutdown, or remote execution of unauthorized shell scripts. Threat actors have likely obtained administrator privileges or established persistent backdoors.`;
      dangerDetails = `The raw log shows high-frequency exploits or persistent outbound heartbeat triggers indicating active command-and-control communication or malicious encryption routines.`;
      mitigationList = `1. **Isolate Compromised Host**: Disconnect the infected host \`${meta.sourceIp}\` immediately from the local subnet to prevent lateral pivoting.
2. **Revoke Credentials**: Force immediate password reset and session termination for all admin and system service accounts.
3. **Block IP Address**: Update perimeter firewall rules to permanently drop all egress/ingress packets connected to \`${meta.sourceIp}\` and close port \`${meta.port}\` immediately.`;
      break;
    case 'High':
      consequence = `Targeted brute-force access, potential application-layer spoofing, or data theft. Left unaddressed, it represents a direct escalation to an active system breach.`;
      dangerDetails = `The log payload includes repeated failed login indicators, system configuration bypass queries, or active exploits targeting exposed network services on port ${meta.port}.`;
      mitigationList = `1. **Perimeter Firewall Drop**: Block the rogue source IP \`${meta.sourceIp}\` immediately from reaching internal addresses.
2. **Deploy Anti-Brute-Force Policies**: Configure local rate-limiting (e.g., fail2ban) to auto-ban IPs with 3 consecutive authentication failures on port \`${meta.port}\`.
3. **Sanitize Inputs & Patch Services**: If targeting web assets, review code parameters and ensure database queries are parameterized.`;
      break;
    case 'Medium':
      consequence = `Network mapping, automated vulnerability scanning, or non-destructive pre-attack reconnaissance. While no data loss is detected, it is highly indicative of preparations for an attack.`;
      dangerDetails = `The payload contains characteristic SYN scan patterns, service-probing sequence queries, or network diagnostic checks launched toward \`${meta.targetIp}\`.`;
      mitigationList = `1. **Restrict Diagnostic Access**: Limit network diagnostic tools or scan permission to internal authorized auditing subnets only.
2. **Configure Port Knocking**: Hide sensitive ports (such as SSH or RDP) behind a secure bastion host or multi-factor VPN gateway.
3. **Disable Exposed Banners**: Configure servers to suppress system versions or OS banners to hinder threat-actor reconnaissance.`;
      break;
    case 'Low':
    default:
      consequence = `Policy violations, misconfigured local services, or trace scans. This event represents a low-probability risk but warrants baseline security configuration hygiene.`;
      dangerDetails = `The logged packet contains unusual header configurations, minor configuration warnings, or trace logs from misrouted internal subnet queries.`;
      mitigationList = `1. **Review Local Configuration**: Audit the local configuration settings on \`${meta.targetIp}\` to rectify misconfigured server variables.
2. **Update Firewall ACLs**: Maintain strict Access Control Lists (ACLs) to ensure only authorized devices are communicating.
3. **Monitor Baseline**: Continue logging anomalous events to verify they are within standard network baseline parameters.`;
      break;
  }

  return `🚨 1. INCIDENT DESCRIPTION (What happened?):
- An alert of type "${alertType}" was captured by the primary monitoring systems.
- Severity Level: **${severity.toUpperCase()}**. Potential business impact includes: ${consequence}

🔍 2. TECHNICAL ANALYSIS (Details):
- **Attacker Source**: ${meta.sourceIp}
- **Target Server**: ${meta.targetIp}
- **Protocol & Port**: ${meta.protocol} / Port ${meta.port}
- **Technical Analysis of Payload**:
  - ${dangerDetails}
  - Handled payload snippet:
    \`\`\`
    ${rawLog.trim()}
    \`\`\`

🛡️ 3. URGENT ACTIONS (What should the administrator do?):
${mitigationList}`;
}

/**
 * Main Mock Agent function. If a specific preset ID is matched, returns its high-fidelity pre-defined report.
 * Otherwise, generates a dynamic high-fidelity report based on log analysis and severity.
 */
export function getMockAgentReport(alertType: string, rawLog: string, severity: 'Critical' | 'High' | 'Medium' | 'Low', presetId?: string): string {
  if (presetId && MOCK_REPORTS[presetId]) {
    return MOCK_REPORTS[presetId];
  }

  // Fallback match by analyzing contents if presetId is missing but matches predefined scenario keywords
  const normalized = (alertType + " " + rawLog).toLowerCase();
  if (normalized.includes("union select") || normalized.includes("sql injection")) {
    return MOCK_REPORTS['sql-injection'];
  }
  if (normalized.includes("failed password") || normalized.includes("ssh") || normalized.includes("brute force")) {
    return MOCK_REPORTS['ssh-brute-force'];
  }
  if (normalized.includes("nmap") || normalized.includes("port scan")) {
    return MOCK_REPORTS['simulated-nmap-scan'];
  }
  if (normalized.includes("beacon") || normalized.includes("c2")) {
    return MOCK_REPORTS['c2-beaconing'];
  }
  if (normalized.includes("ransomware") || normalized.includes("smb2_com_session")) {
    return MOCK_REPORTS['ransomware-movement'];
  }

  // Otherwise generate highly custom structured template matching selected severity exactly
  return generateDynamicReport(alertType, rawLog, severity);
}
