const { withEntitlementsPlist } = require('@expo/config-plugins')

const ENTITLEMENT = 'com.apple.developer.pass-type-identifiers'

/**
 * Adds the Apple Wallet `pass-type-identifiers` entitlement, required by
 * `getPasses`, `containsPass` and `removePass` on iOS. Existing identifiers are kept.
 * Without `passTypeIdentifiers` the plugin does nothing: adding the entitlement
 * requires it to be enabled on your App ID, so it is opt-in.
 *
 * @param {import('@expo/config-plugins').ExportedConfig} config
 * @param {{ passTypeIdentifiers?: string[] }} [options]
 */
module.exports = function withWallet(config, options = {}) {
  const identifiers = options.passTypeIdentifiers ?? []
  if (identifiers.length === 0) return config

  return withEntitlementsPlist(config, (config) => {
    const existing = config.modResults[ENTITLEMENT] ?? []
    config.modResults[ENTITLEMENT] = [...new Set([...existing, ...identifiers])]
    return config
  })
}
