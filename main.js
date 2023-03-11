const d = document
const $btnDownload = d.getElementById('download')
const $btnClean = d.getElementById('clean')
const $rotateOptions = d.querySelectorAll('#rotate button')
const $filterOptions = d.querySelectorAll('#filter button')
const $filterSlider = d.querySelector('.slider input')
const $filterName = d.querySelector('.name')
const $filterValue = d.querySelector('.value')
const $change = d.getElementById('change-img')

const $input = document.querySelector('#file-input')
const $imgPreview = document.querySelector('#img-preview')

let brightness = '100'
let saturation = '100'
let inversion = '0'
let grayscale = '0'
let rotate = 0

const init = () => {
  brightness = '100'
  saturation = '100'
  inversion = '0'
  grayscale = '0'
  rotate = 0
  $filterOptions[0].click()
  applyFilter()
}

const load = () => {
  const file = $input.files

  if (!file) return

  const objectURL = URL.createObjectURL(file[0])

  $imgPreview.src = objectURL

  // filter reset
  $imgPreview.addEventListener('load', () => {
    init()
  })
}

const applyFilter = () => {
  $imgPreview.style.transform = `rotate(${rotate}deg)`
  $imgPreview.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}

// Rotate apply

$rotateOptions.forEach(option => {
  option.addEventListener('click', () => {
    if (option.id === 'left') {
      rotate -= 90
    } else if (option.id === 'right') {
      rotate += 90
    }
    applyFilter()
  })
})

// Effect layout

$filterOptions.forEach(option => {
  option.addEventListener('click', () => {
    document.querySelector('.active').classList.remove('active')
    option.classList.add('active')

    $filterName.innerText = option.innerText

    if (option.id === 'brightness') {
      $filterSlider.max = '200'
      $filterSlider.value = brightness
      $filterValue.innerText = `${brightness}%`
    } else if (option.id === 'saturation') {
      $filterSlider.max = '200'
      $filterSlider.value = saturation
      $filterValue.innerText = `${saturation}%`
    } else if (option.id === 'inversion') {
      $filterSlider.max = '100'
      $filterSlider.value = inversion
      $filterValue.innerText = `${inversion}%`
    } else {
      $filterSlider.max = '100'
      $filterSlider.value = grayscale
      $filterValue.innerText = `${grayscale}%`
    }
  })
})

// Filter apply

const changeFilter = () => {
  $filterValue.innerText = `${$filterSlider.value}%`
  const $selectedFilter = document.querySelector('.filter .active')
  if ($selectedFilter.id === 'brightness') {
    brightness = $filterSlider.value
  } else if ($selectedFilter.id === 'saturation') {
    saturation = $filterSlider.value
  } else if ($selectedFilter.id === 'inversion') {
    inversion = $filterSlider.value
  } else {
    grayscale = $filterSlider.value
  }
  applyFilter()
}

$btnClean.addEventListener('click', init)
$filterSlider.addEventListener('input', changeFilter)
$input.addEventListener('change', load)
$change.addEventListener('click', () => $input.click())
