/**
 * @copyright Copyright (c) 2023 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
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
import logger from '../utils/logger'

export type DavProperty = { [key: string]: string }

export const defaultDavProperties = [
	'd:getcontentlength',
	'd:getcontenttype',
	'd:getetag',
	'd:getlastmodified',
	'd:quota-available-bytes',
	'd:resourcetype',
	'nc:has-preview',
	'nc:is-encrypted',
	'nc:mount-type',
	'nc:share-attributes',
	'oc:comments-unread',
	'oc:favorite',
	'oc:fileid',
	'oc:owner-display-name',
	'oc:owner-id',
	'oc:permissions',
	'oc:share-types',
	'oc:size',
	'ocs:share-permissions',
]

export const defaultDavNamespaces = {
	d: 'DAV:',
	nc: 'http://nextcloud.org/ns',
	oc: 'http://owncloud.org/ns',
	ocs: 'http://open-collaboration-services.org/ns',
}

/**
 * Register custom DAV properties
 *
 * Can be used if your app introduces custom DAV properties, so e.g. the files app can make use of it.
 *
 * @param prop The property
 * @param namespace The namespace of the property
 */
export const registerDavProperty = function(prop: string, namespace: DavProperty = { nc: 'http://nextcloud.org/ns' }): boolean {
	if (typeof window._nc_dav_properties === 'undefined') {
		window._nc_dav_properties = [...defaultDavProperties]
		window._nc_dav_namespaces = { ...defaultDavNamespaces }
	}

	const namespaces = { ...window._nc_dav_namespaces, ...namespace }

	// Check duplicates
	if (window._nc_dav_properties.find(search => search === prop)) {
		logger.error(`${prop} already registered`, { prop })
		return false
	}

	if (prop.startsWith('<') || prop.split(':').length !== 2) {
		logger.error(`${prop} is not valid. See example: 'oc:fileid'`, { prop })
		return false
	}

	const ns = prop.split(':')[0]
	if (!namespaces[ns]) {
		logger.error(`${prop} namespace unknown`, { prop, namespaces })
		return false
	}

	window._nc_dav_properties.push(prop)
	window._nc_dav_namespaces = namespaces
	return true
}

/**
 * Get the registered dav properties
 */
export const getDavProperties = function(): string {
	if (typeof window._nc_dav_properties === 'undefined') {
		window._nc_dav_properties = [...defaultDavProperties]
	}

	return window._nc_dav_properties.map(prop => `<${prop} />`).join(' ')
}

/**
 * Get the registered dav namespaces
 */
export const getDavNameSpaces = function(): string {
	if (typeof window._nc_dav_namespaces === 'undefined') {
		window._nc_dav_namespaces = { ...defaultDavNamespaces }
	}

	return Object.keys(window._nc_dav_namespaces).map(ns => `xmlns:${ns}="${window._nc_dav_namespaces?.[ns]}"`).join(' ')
}

/**
 * Get the default PROPFIND request body
 */
export const davGetDefaultPropfind = function(): string {
	return `<?xml version="1.0"?>
		<d:propfind ${getDavNameSpaces()}>
			<d:prop>
				${getDavProperties()}
			</d:prop>
		</d:propfind>`
}

/**
 * Get the REPORT body to filter for favorite nodes
 */
export const davGetFavoritesReport = function(): string {
	return `<?xml version="1.0"?>
		<oc:filter-files ${getDavNameSpaces()}>
			<d:prop>
				${getDavProperties()}
			</d:prop>
			<oc:filter-rules>
				<oc:favorite>1</oc:favorite>
			</oc:filter-rules>
		</oc:filter-files>`
}
