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

  $imgPreview.addEventListener('load', () => {
    init()
  })
}

const applyFilter = () => {
  $imgPreview.style.transform = `rotate(${rotate}deg)`
  $imgPreview.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}

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

const download = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // Obtén las dimensiones originales de la imagen
  const originalWidth = $imgPreview.naturalWidth
  const originalHeight = $imgPreview.naturalHeight

  // Calcula las dimensiones del canvas después de aplicar la rotación
  const radians = (rotate * Math.PI) / 180
  const rotatedWidth =
    Math.abs(Math.cos(radians) * originalWidth) +
    Math.abs(Math.sin(radians) * originalHeight)
  const rotatedHeight =
    Math.abs(Math.sin(radians) * originalWidth) +
    Math.abs(Math.cos(radians) * originalHeight)

  // Establece las dimensiones del canvas según la rotación
  canvas.width = rotatedWidth
  canvas.height = rotatedHeight

  // Mueve el canvas al centro
  ctx.translate(rotatedWidth / 2, rotatedHeight / 2)

  // Aplica los efectos al contexto antes de dibujar la imagen
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`

  // Rota la imagen
  ctx.rotate(radians)

  // Dibuja la imagen dentro del canvas
  ctx.drawImage(
    $imgPreview,
    -originalWidth / 2,
    -originalHeight / 2,
    originalWidth,
    originalHeight
  )

  const link = document.createElement('a')
  link.download = 'image.jpg'
  link.href = canvas.toDataURL()
  link.click()
}

$btnClean.addEventListener('click', init)
$filterSlider.addEventListener('input', changeFilter)
$input.addEventListener('change', load)
$change.addEventListener('click', () => $input.click())
$btnDownload.addEventListener('click', download)
