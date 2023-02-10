import * as path from 'path';
import * as fs from 'fs';

/**
 * Return the relative path of a file (to) compared with file of reference (from)
 * @param from file of reference
 * @param to file to find the relative path
 * @returns a path
 */
export function findRelativePath(from: string, to: string): string {
    const findFile = (dir: string, fileName: string): string => {
        if (path.basename(dir) === 'node_modules') {
            return '';
        }

        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                const result = findFile(filePath, fileName);
                if (result) {
                    return result;
                }
            } else if (file === fileName) {
                return filePath;
            }
        }
        return '';
    };

    const fromPath = findFile(process.cwd(), from);
    const toPath = findFile(process.cwd(), to);
    return path.relative(path.dirname(fromPath), path.dirname(toPath));
}

// Generate a full path
export function generateFullPath(from: string, to: string) {
 return `${findRelativePath(from, to).replace(/\\/g, '/')}/${to}`
}