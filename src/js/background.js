import { createStore } from 'redux'
import { wrapStore } from 'react-chrome-redux'
import { saved } from './editor/actions'
import rootReducer from './editor/reducers'

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		};
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow)
      func.apply(context, args)
	}
}

/**
 * Save data to Chrome's Sync storage
 * @param  {string} key        A key, which is used to reference this data in the storage
 * @param  {*} value           A value to store
 * @param  {boolean} mergeValue If `value` is an object, setting this to true will keep keys
 *                              from the original value that are unchaned in the new value
 * @return {Promise}            The promise is resolved when the operation has completed
 * @resolves {undefined}        No value is passed
 */
function saveToStorage(key, value, mergeValue) {
  return new Promise(function (resolve, reject) {
    if (mergeValue) {
      // We'll need to retrieve the previous value first
      chrome.storage.sync.get(null, function (storage) {
        const previousValue =
          key === undefined
            ? storage
            : storage[key]
        // Merge the old and new values
        const newValue = Object.assign({}, previousValue, value)
        chrome.storage.sync.set(
          key === undefined
            ? newValue
            : {[key]: newValue},
          function() {
            resolve()
        })
      })
    } else {
      const newVal =
        key === undefined
          ? value
          : {[key]: value}
      chrome.storage.sync.set(
        newVal,
        function() {
          resolve()
      })
    }
  })
}

/**
 * Retrieves data from Chrome's sync storage
 * @param   {string}  key   The key to retrieve
 * @returns {Promise}       Resolves when the data has been retrieved
 * @resolves {*}            The value of the key. It may be any value allowed in Chrome storage.
 */
function loadFromStorage(key) {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get(null, function (storage) {
      if (key !== undefined) {
        resolve(storage[key])
      } else {
        resolve(storage)
      }
    })
  })
}

const saveStore = (store) => {
  const state = store.getState()
  if (!state.saved) {
    const copyState = Object.assign({}, state)
    delete copyState.saved
    saveToStorage(undefined, copyState, true)
      .then(() => {
        store.dispatch(saved())
      })
  }
}

loadFromStorage()
  .then(result => {
		try {
			const { snippets } = result
			Object.keys(snippets).forEach(id => {
				if (snippets[id].content) {
					result.snippets[id].body = snippets[id].content
				}
			})
		} catch (e) {}
    const store = createStore(rootReducer, result)
    wrapStore(store, {portName: 'SNIPPETS'})

    store.subscribe(debounce(() => saveStore(store), 1500))
  })