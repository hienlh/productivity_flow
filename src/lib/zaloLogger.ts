import { promises as fs } from 'fs';
import path from 'path';

interface ZaloAPILog {
  timestamp: string;
  apiCall: string;
  request: {
    url: string;
    method: string;
    headers: Record<string, any>;
    body: any;
  };
  response: {
    status: number;
    ok: boolean;
    data: any;
  };
  error?: any;
}

/**
 * Logger utility to log Zalo API calls to markdown files
 */
export class ZaloLogger {
  private static logDir = path.join(process.cwd(), 'logs', 'zalo');
  
  /**
   * Initialize log directory
   */
  private static async ensureLogDir() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  /**
   * Get log file path for today
   */
  private static getLogFilePath(): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logDir, `zalo-api-log-${today}.md`);
  }

  /**
   * Log API call to markdown file
   */
  static async log(logData: ZaloAPILog) {
    await this.ensureLogDir();
    
    const logFilePath = this.getLogFilePath();
    const logEntry = this.formatLogEntry(logData);
    
    try {
      // Append to file
      await fs.appendFile(logFilePath, logEntry + '\n\n---\n\n');
      console.log(`✅ Logged to: ${logFilePath}`);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  /**
   * Format log entry as markdown
   */
  private static formatLogEntry(logData: ZaloAPILog): string {
    const { timestamp, apiCall, request, response, error } = logData;
    
    let markdown = `## 🔵 ${apiCall}\n\n`;
    markdown += `**Timestamp:** ${timestamp}\n\n`;
    
    // Request section
    markdown += `### 📤 Request\n\n`;
    markdown += `- **URL:** \`${request.url}\`\n`;
    markdown += `- **Method:** \`${request.method}\`\n\n`;
    
    markdown += `**Headers:**\n\n`;
    markdown += '```json\n';
    markdown += JSON.stringify(this.sanitizeHeaders(request.headers), null, 2);
    markdown += '\n```\n\n';
    
    if (request.body) {
      markdown += `**Body:**\n\n`;
      markdown += '```json\n';
      markdown += JSON.stringify(this.sanitizeBody(request.body), null, 2);
      markdown += '\n```\n\n';
    }
    
    // Response section
    markdown += `### 📥 Response\n\n`;
    markdown += `- **Status:** ${response.status} ${response.ok ? '✅' : '❌'}\n`;
    markdown += `- **OK:** ${response.ok}\n\n`;
    
    markdown += `**Data:**\n\n`;
    markdown += '```json\n';
    markdown += JSON.stringify(this.sanitizeResponse(response.data), null, 2);
    markdown += '\n```\n\n';
    
    // Error section (if any)
    if (error) {
      markdown += `### ❌ Error\n\n`;
      markdown += '```json\n';
      markdown += JSON.stringify(error, null, 2);
      markdown += '\n```\n\n';
    }
    
    return markdown;
  }

  /**
   * Sanitize headers - mask sensitive data but show structure
   */
  private static sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sanitized = { ...headers };
    
    if (sanitized.secret_key) {
      sanitized.secret_key = this.maskValue(sanitized.secret_key);
    }
    if (sanitized.access_token) {
      sanitized.access_token = this.maskValue(sanitized.access_token);
    }
    
    return sanitized;
  }

  /**
   * Sanitize body - mask sensitive data but show structure
   */
  private static sanitizeBody(body: any): any {
    if (typeof body === 'string') {
      // Parse if it's URL encoded
      try {
        const params = new URLSearchParams(body);
        const obj: Record<string, any> = {};
        params.forEach((value, key) => {
          if (key === 'code_verifier' || key === 'code') {
            obj[key] = this.maskValue(value);
          } else {
            obj[key] = value;
          }
        });
        return obj;
      } catch {
        return body;
      }
    }
    
    const sanitized = { ...body };
    if (sanitized.code_verifier) {
      sanitized.code_verifier = this.maskValue(sanitized.code_verifier);
    }
    if (sanitized.code) {
      sanitized.code = this.maskValue(sanitized.code);
    }
    
    return sanitized;
  }

  /**
   * Sanitize response - mask tokens but show structure
   */
  private static sanitizeResponse(data: any): any {
    if (!data) return data;
    
    const sanitized = { ...data };
    
    if (sanitized.access_token) {
      sanitized.access_token = this.maskValue(sanitized.access_token) + ' (masked)';
    }
    if (sanitized.refresh_token) {
      sanitized.refresh_token = this.maskValue(sanitized.refresh_token) + ' (masked)';
    }
    
    return sanitized;
  }

  /**
   * Mask sensitive value - show first 10 and last 4 characters
   */
  private static maskValue(value: string): string {
    if (value.length <= 14) {
      return '***' + value.slice(-4);
    }
    return value.slice(0, 10) + '...' + value.slice(-4);
  }

  /**
   * Create summary file with all logged API calls
   */
  static async createSummary() {
    await this.ensureLogDir();
    const summaryPath = path.join(this.logDir, 'README.md');
    
    const summary = `# Zalo API Logs

Tập hợp các API calls đến Zalo OAuth được log tự động.

## Log Files

Mỗi ngày sẽ tạo một file log mới với format: \`zalo-api-log-YYYY-MM-DD.md\`

## Thông tin được log

- **Timestamp**: Thời điểm gọi API
- **API Call**: Tên API được gọi
- **Request**: URL, method, headers, body
- **Response**: Status code, data
- **Error**: Lỗi nếu có

## Sensitive Data

Các dữ liệu nhạy cảm (tokens, secrets, codes) được mask để bảo mật:
- Chỉ hiển thị 10 ký tự đầu và 4 ký tự cuối
- Ví dụ: \`abcdefghij...xyz\`

## Mục đích

Giúp debug và hiểu rõ response từ Zalo API để implement integration một cách chính xác.
`;
    
    try {
      await fs.writeFile(summaryPath, summary);
      console.log(`✅ Created summary at: ${summaryPath}`);
    } catch (error) {
      console.error('Failed to create summary:', error);
    }
  }
}
