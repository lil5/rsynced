const create = require('../src/create')
// const rsync = require('rsync')
const ava = require('ava')
// const fs = require('fs')

const test = ava.test

const example = () => {
  return {
    ssh: {
      dest: {
        host: 'localhost',
        user: 'lil',
        path: '/media/lil/RedCard/Projects/rsynced/example/dir1/',
      },
      src: {
        host: 'localhost',
        user: 'lil',
        path: '/media/lil/RedCard/Projects/rsynced/example/dir0/',
      },
    },
    src: 'example/dir0',
    dest: 'example/dir1',
    chown: ':www-data',
    cwd: process.cwd(),
  }
}

test('should create valid ssh command', t => {
  let myExample = example()
  delete myExample.src
  delete myExample.ssh.dest

  t.true((
    create(myExample).command() === 'rsync --progress --chown=:www-data --rsh=ssh lil@localhost:/media/lil/RedCard/Projects/rsynced/example/dir0/ example/dir1'
  ))
})

test('duel ssh remotes', t => {
  let myExample = example()
  delete myExample.src
  delete myExample.dest

  t.is(
    t.throws(() => {
      create(myExample)
    }).message,
    `the source and destination cannot both be remote`
  )
})

// let isSrc = false
const giveSrc = bool => bool ? 'src' : 'dest'
const giveSource = bool => bool ? 'source' : 'destination'
;[true, false].forEach(isSrc => {
  test(`give error ${giveSource(isSrc)} is not set`, t => {
    let myExample = example()
    delete myExample[giveSrc(isSrc)]
    delete myExample.ssh

    t.is(
      t.throws(() => {
        create(myExample)
      }).message,
      `${giveSource(isSrc)} not set`
    )
  })
}) // end isSrc

;[1, 2, false].forEach(isSsh => {
  test(`should create valid command with ${!isSsh ? 'local' : isSsh === 1 ? 'remote to local' : 'local to remote'}`, t => {
    let myExample = example()

    // remove unnecessary items
    if (isSsh === false) { // if local
      delete myExample.ssh
    } else if (isSsh === 1) { // if remote.src to local.dest
      delete myExample.ssh.dest
      delete myExample.src
    } else { // if local.src to remote.dest
      delete myExample.ssh.src
      delete myExample.dest
    }

    let ans = create(myExample).command()

    switch (isSsh) {
      // case [[true, true], [true, true]]:
      case false:
        t.true(
          ans === 'rsync --progress --chown=:www-data example/dir0 example/dir1'
        )
        break
      case 2:
        t.true(
          ans === 'rsync --progress --chown=:www-data --rsh=ssh example/dir0 lil@localhost:/media/lil/RedCard/Projects/rsynced/example/dir1/'
        )
        break
      case 1:
        t.true((
          ans === 'rsync --progress --chown=:www-data --rsh=ssh lil@localhost:/media/lil/RedCard/Projects/rsynced/example/dir0/ example/dir1'
        ))
        break
    }
  })
})
