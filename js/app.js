const enterAnimation = (container) => {
    // from run the animation backwars from the specified properties to the default properties(defined css properties)
    /* return gsap.from(container, {
        autoAlpha: 0,
        duration: 1,
        clearProps: true,
        ease: "none",
    }); */
    const activeLink = container.querySelector("a.is-active span");
    const projects = container.querySelectorAll(".project");
    const images = container.querySelectorAll(".image");
    const imgs = container.querySelectorAll("img");
    const tl = gsap.timeline({
        defaults: {
            duration: 0.9,
            ease: "power4.out",
        },
    });

    tl.set(projects, { autoAlpha: 1 })
        .fromTo(activeLink, { x: "-105%" }, { x: 0 })
        .fromTo(images, { xPercent: -101 }, { xPercent: 0, stagger: 0.1 }, 0)
        .fromTo(imgs, { xPercent: 101 }, { xPercent: 0, stagger: 0.1 }, 0);
};

// autoalpha = 1 => opacity 1 + visibily visible
const leaveAnimation = (container, done) => {
    /* return gsap.to(container, {
        autoAlpha: 0,
        duration: 0.75,
        clearProps: true,
        ease: "none",
        onComplete: () => {
            done();
        },
    }); */
    const activeLink = container.querySelector("a.is-active span");
    const images = container.querySelectorAll(".image");
    const imgs = container.querySelectorAll("img");
    const tl = gsap.timeline({
        default: {
            ease: "power4.out",
            duration: 0.9,
        },
    });

    tl.fromTo(
        activeLink,
        { x: 0 },
        {
            x: "102%",
            onComplete: () => {
                done();
            },
        }
    )
        .fromTo(images, { x: 0 }, { x: "120%", stagger: 0.1 }, 0)
        .fromTo(imgs, { x: 0 }, { x: "-102%", stagger: 0.1 }, 0);
};

const resetActiveLinks = () => {
    gsap.set("a.is-active span", {
        x: "-100%",
    });
};

const revealProject = (container) => {
    const headerLink = container.querySelector("header a");
    const images = container.querySelectorAll(".image");
    const content = container.querySelectorAll(".content");
    const h1 = container.querySelectorAll("h1");
    const img = container.querySelectorAll("img");
    const hero = container.querySelector(".hero");

    const tl = gsap.timeline({
        defaults: {
            duration: 1.2,
            ease: "power4.out",
        },
    });

    tl.set(hero, { autoAlpha: 1 })
        .from(
            images,
            {
                xPercent: -101,
                stagger: 0.1,
            },
            0
        )
        .from(
            img,
            {
                xPercent: 101,
                stagger: 0.1,
            },
            0
        )
        .from(
            h1,
            {
                xPercent: 70,
                stagger: 0.1,
            },
            0
        )
        .from(
            headerLink,
            {
                yPercent: 101,
            },
            0
        )
        .from(
            content,
            {
                autoAlpha: 0,
                y: 20,
            },
            0.2
        );
    return tl;
};

const leaveFromProject = (container) => {
    const headerLink = container.querySelector("header a");
    const projects = container.querySelectorAll(".image");
    const images = container.querySelectorAll("img");
    const content = container.querySelectorAll(".content");
    const tl = gsap.timeline({
        defaults: {
            duration: 0.4,
            ease: "power4.out",
        },
    });
    tl.to(headerLink, { yPercent: 101 }, 0)
        .to(projects, { xPercent: 101, stagger: 0.05 }, 0)
        .to(content, { autoAlpha: 0, ease: none }, 0)
        .to(images, { xPercent: -101, stagger: 0.05 }, 0);
    return tl;
};

const leaveToProject = (container, done) => {
    const navLinks = container.querySelectorAll("header a");
    const projects = container.querySelectorAll(".image");
    const images = container.querySelectorAll("img");

    const tl = gsap.timeline({
        defaults: {
            duration: 0.4,
            ease: "power4.out",
        },
    });

    tl.to(
        navLinks,
        {
            yPercent: 101,
            stagger: 0.05,
        },
        0
    )
        .to(projects, { xPercent: 101, stagger: 0.05 }, 0)
        .to(
            images,
            {
                xPercent: -101,
                stagger: 0.05,
                onComplete: () => {
                    done();
                },
            },
            0
        );
};

// global hooks
/*barba.hooks. This will execute code everytime the hook is called in the lifecycle. What makes the hook global is that the definition is not wrap inside a Transition or a View. You can combine base and global hooks. */
barba.hooks.enter(() => {
    console.log("enter");
    window.scrollTo(0, 0);
});
// the barba always use the last transition unless you use use to namespace
barba.init({
    /*Views allows you to have some logic related to the content of a namespace.
It’s a good place to init or destroy things, making the code run in a confined place. */
    views: [
        {
            namespace: "details",
            beforeEnter(data) {
                console.log("before enter details");
            },
        },
    ],
    transitions: [
        {
            name: "from-detail",
            from: {
                namespace: ["details"],
            },
            leave({ current }) {},
            enter({ next }) {
                console.log("entering");
                gsap.from("header a", {
                    duration: 0.6,
                    yPercent: 100,
                    stagger: 0.2,
                    ease: "power1.out",
                    onComplete: () => enterAnimation(next.container),
                });
            },
        },
        {
            name: "details",
            to: {
                namespace: ["details"],
            },
            once({ next }) {
                console.log("once hooks");
                revealProject(next.container);
            },
            leave: function ({ current }) {
                console.log("leaving detail");
                const done = this.async();
                leaveToProject(current.container, done);
            },
            enter: ({ next }) => {
                console.log("enter details");
                revealProject(next.container);
            },
        },
        {
            name: "general-transition",
            once({ next }) {
                console.log("once");
                resetActiveLinks();
                gsap.from("header a", {
                    duration: 1,
                    yPercent: 100,
                    stagger: 0.2,
                    ease: "power1.out",
                    onComplete: () => {
                        enterAnimation(next.container);
                    },
                });
            },
            leave({ current }) {
                console.log("leaving");
                const done = this.async();
                leaveAnimation(current.container, done);
            },
            enter({ next }) {
                console.log("entering");
                enterAnimation(next.container);
            },
        },
    ],
});
