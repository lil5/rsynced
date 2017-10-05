const templates = {}

templates.json = (options) => `{
\tdestinations: [
\t\t{
\t\t\tname: 'default',
\t\t\tsrc: '',
\t\t\t${options.isSSH ? `// dest: '',
\t\t\tssh: { dest: {
\t\t\t\thost: 'localhost',
\t\t\t\tuser: 'lil',
\t\t\t\tpath: '/',
\t\t\t\tkey: './my.key',
\t\t\t}},` : `dest: '',`}
\t\t\tdelete: false,
\t\t\tflags: 'udra',
\t\t\texclude: [ '.rsync-filter' ],
\t\t},
\t],
}
`

templates.toml = (options) => `[[destinations]]
name = 'default'
src = ''${options.isSSH ? '' : `
dest = ''`}
delete = false
flags = 'udra'
exclude = ['.rsync-filter']${options.isSSH ? `

[destinations.ssh.dest]
\thost = 'localhost'
\tuser = 'lil'
\tpath = '/'
\tkey = './my.key'` : ''}
`

module.exports = templates
