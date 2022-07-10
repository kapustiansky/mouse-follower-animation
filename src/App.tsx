import './App.css';
import gsap from 'gsap';
import MouseFollower from 'mouse-follower';
import { useEffect, useRef, FC } from 'react';

MouseFollower.registerGSAP(gsap);

const App: FC = () => {
	const imgRef = useRef<HTMLDivElement>(null);
	const meRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const imgContainer = imgRef.current;
		if (imgContainer) {
			let elTurbulence = document.getElementById('turbulence');
			let img = document.querySelector('.image-example img');

			const mouseenter = () => {
				gsap.to(img, {
					ease: 'power4',
					scale: 1.1,
				});
				gsap.fromTo(
					elTurbulence,
					{
						attr: { baseFrequency: '0.02 0.03' },
					},
					{
						duration: 4,
						ease: 'power4',
						attr: { baseFrequency: '0 0' },
					}
				);
			};

			const mouseleave = () => {
				gsap.fromTo(
					elTurbulence,
					{
						attr: { baseFrequency: '0.02 0.03' },
					},
					{
						duration: 3,
						ease: 'power4',
						attr: { baseFrequency: '0 0' },
					}
				);
				gsap.to(img, {
					ease: 'power2',
					scale: 1,
				});
			};

			imgContainer.addEventListener('mouseleave', mouseleave);
			imgContainer.addEventListener('mouseenter', mouseenter);

			return () => {
				imgContainer.removeEventListener('mouseleave', mouseleave);
				imgContainer.removeEventListener('mouseenter', mouseenter);
			};
		}
	}, []);

	useEffect(() => {
		const imgEl = imgRef.current;
		if (imgEl) {
			const cursor = new MouseFollower({
				container: '#root',
				speed: 0.3,
			});

			const mouseenter = () => {
				cursor.setSkewing(6);
			};

			const mouseleave = () => {
				cursor.removeSkewing();
			};

			imgEl.addEventListener('mouseenter', mouseenter);
			imgEl.addEventListener('mouseleave', mouseleave);

			return () => {
				imgEl.removeEventListener('mouseenter', mouseenter);
				imgEl.removeEventListener('mouseleave', mouseleave);
				cursor.destroy();
			};
		}
	}, []);

	useEffect(() => {
		const me = meRef.current;
		if (me) {
			const mouseleave = (ev: MouseEvent) => {
				gsap.to(ev.currentTarget, {
					x: 0,
					y: 0,
				});
				gsap.to('.follow-me', {
					duration: 0.3,
					scale: 1,
					ease: 'power4.out',
					x: 0,
					y: 0,
				});
			};

			const mouseenter = () => {
				gsap.to('.follow-me', {
					duration: 0.3,
					scale: 1.2,
				});
			};

			const mousemove = (ev: MouseEvent) => {
				callParallax(ev);
			};

			const callParallax = (ev: MouseEvent) => {
				if (ev.currentTarget) {
					parallaxIt(ev, ev.currentTarget, 60);
				}
				parallaxIt(ev, '.follow-me', 40);
			};

			const parallaxIt = (
				ev: MouseEvent,
				target: string | EventTarget,
				movement: number
			) => {
				if (me) {
					let boundingRect = me.getBoundingClientRect();
					let relX = ev.pageX - (boundingRect.left + window.scrollX);
					let relY = ev.pageY - (boundingRect.top + window.scrollY);

					gsap.to(target, 0.3, {
						x:
							((relX - boundingRect.width / 2) /
								boundingRect.width) *
							movement,
						y:
							((relY - boundingRect.height / 2) /
								boundingRect.height) *
							movement,
						ease: 'power4.out',
					});
				}
			};

			me.addEventListener('mouseleave', mouseleave);
			me.addEventListener('mouseenter', mouseenter);
			me.addEventListener('mousemove', mousemove);

			return () => {
				me.removeEventListener('mouseleave', mouseleave);
				me.removeEventListener('mouseenter', mouseenter);
				me.removeEventListener('mousemove', mousemove);
			};
		}
	}, []);

	return (
		<main className='container'>
			<div className='text-example' data-cursor-text='LOL'>
				<span data-cursor='-exclusion'>Lorem</span>
			</div>
			<div
				ref={imgRef}
				className='image-example'
				data-cursor='-purple'
				data-cursor-text='LOL'>
				<svg>
					<filter id='noise' x='0%' y='0%' width='100%' height='100%'>
						<feTurbulence
							baseFrequency='0 0'
							type='fractalNoise'
							result='NOISE'
							numOctaves='1'
							id='turbulence'
						/>
						<feDisplacementMap
							id='displacementMap'
							xChannelSelector='R'
							yChannelSelector='G'
							in='SourceGraphic'
							in2='NOISE'
							scale='20'
						/>
					</filter>
				</svg>
				<div className='lol'>
					<img
						src='https://cdn.cuberto.com/cb/img/sleepiest/face.jpg'
						alt=''></img>
				</div>
			</div>
			<div
				className='video-example'
				data-cursor-video='https://cdn.cuberto.com/cb/video/hero/0.mp4'
				data-cursor='-exclusion'>
				<span>Ipsum</span>
			</div>
			<div
				ref={meRef}
				className='follow-container'
				data-cursor-stick='.follow-me'
				data-cursor='-me -exclusion'>
				<a href='https://kapustiansky.tk/' className='follow-me'>
					my
				</a>
			</div>
		</main>
	);
};

export default App;
