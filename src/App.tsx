import './App.css';
import gsap from 'gsap';
import MouseFollower from 'mouse-follower';
import { useEffect, useRef, FC } from 'react';
MouseFollower.registerGSAP(gsap);

const App: FC = () => {
	const imgRef = useRef<HTMLDivElement>(null);
	const meRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const cursor = new MouseFollower({
			container: '#root',
			speed: 0.3,
		});
		const imgEl = imgRef.current;

		const mouseenter = () => {
			cursor.setSkewing(6);
		};

		const mouseleave = () => {
			cursor.removeSkewing();
		};

		if (imgEl) {
			imgEl.addEventListener('mouseenter', mouseenter);
			imgEl.addEventListener('mouseleave', mouseleave);

			return () => {
				imgEl.removeEventListener('mouseenter', mouseenter);
				imgEl.removeEventListener('mouseleave', mouseleave);
			};
		}
	}, []);

	useEffect(() => {
		const me = meRef.current;

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
						((relX - boundingRect.width / 2) / boundingRect.width) *
						movement,
					y:
						((relY - boundingRect.height / 2) /
							boundingRect.height) *
						movement,
					ease: 'power4.out',
				});
			}
		};

		if (me) {
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
				<img
					src='https://cdn.cuberto.com/cb/img/sleepiest/face.jpg'
					alt=''></img>
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
