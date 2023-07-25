/**
 * @copyright Copyright (c) 2022 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import { FileType } from './fileType'
import { Node } from './node'
import { NodeData } from './nodeData'

export class Folder extends Node {

	constructor(data: NodeData) {
		// enforcing mimes
		super({
			...data,
			mime: 'httpd/unix-directory',
		})
	}

	get type(): FileType {
		return FileType.Folder
	}

	get extension(): string|null {
		return null
	}

	get mime(): string {
		return 'httpd/unix-directory'
	}

}
