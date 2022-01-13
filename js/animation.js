const tl = gsap.timeline({ defaults: { ease: "power1.out" } });

tl.to(".intro_pokeball_icon", { y: "0%", duration: 1, stagger: 0.25 });
tl.to(".slider", { y: "-100%", duration: 1.5, delay: 0.5 });
tl.to(".intro", { y: "-100%", duration: 1}, "-=0.9" );
tl.fromTo(".header_logo", { opacity: 0 }, { opacity: 1, duration: 0.5 } );
tl.fromTo(".header_title", { opacity: 0 }, { opacity: 1, duration: 0.4 } );
tl.fromTo(".header_paragraph", { opacity: 0 }, { opacity: 1, duration: 0.4 } );
tl.fromTo(".btn_ir_al_código", { opacity: 0 }, { opacity: 1, duration: 0.4 } );