import './style.css'

const navigationRoutes = [
	{ name: 'Store', route: '#store' },
	{ name: 'Mac', route: '#mac' },
	{ name: 'iPhone', route: '#iphone' },
  { name: 'watch', route: '#watch' },
	{ name: 'Vision', route: '#vision' },
	{ name: 'AirPods', route: '#airpods' },
]

const navigation = document.querySelector('.nav-links')

navigationRoutes.forEach((elem) => {
	const link = document.createElement('a')
  link.className='text-white/70 hover:text-white transition-all duration-300'
	link.innerHTML = elem.name
	link.href = elem.route
	navigation.append(link)
})



