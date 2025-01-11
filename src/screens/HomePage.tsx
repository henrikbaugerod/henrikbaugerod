import { AnimatePresence, motion } from "motion/react"
import Header from "../components/Header";
import Button from "../components/Button";
import { TypeAnimation } from "react-type-animation";
import { useConfigContext } from "../providers/ConfigProvider";
import { useEffect } from "react";

const Homepage = () => {
    const { firstRender, setFirstRender } = useConfigContext();

    useEffect(() => {
        // Set firstRender to false after animation completes
        if (firstRender) {
            const timer = setTimeout(() => {
                setFirstRender(false);
            }, 6250); // 4.75s delay + 1.5s animation duration

            // Cleanup to reset firstRender if the user leaves the page
            return () => clearTimeout(timer);
        }
    }, [firstRender, setFirstRender]);

    return (
        <>
            <Header />
            <div className="homepage-wrapper">
                {firstRender && (
                    <motion.div
                        initial={{ y: "0%" }}
                        animate={{ y: "calc(-100%)" }}
                        transition={{ duration: 1.5, delay: 4.75 }}
                        className="homepage-opener"
                    >
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <TypeAnimation
                                sequence={[
                                    // Same substring at the start will only be typed once, initially
                                    'Henrik Baugerød',
                                    500,
                                    'Webutvikler',
                                ]}
                                speed={20}
                                style={{ fontSize: '5rem' }}
                                className="text-white typewriter-text"
                            />
                        </div>
                    </motion.div>
                )}


                <div className="homepage-bubbles position-fixed">
                    <Bubbles />
                </div>

                <div className="homepage-content">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6 order-1 order-md-0">
                                {/* <span className="text-white opacity-50">Henrik Baugerød</span> */}
                                <h1 className="text-white">System- og webutvikler</h1>
                                <p>Henrik her - en vanlig utvikler som trives med å løse problemer å skape noe nytt. Når jeg ikke sitter foran skjermen, liker jeg å spille padel (og bygge LEGO). Jeg er alltid nysgjerrig på nye utfordringer og setter pris på hyggelige samtaler over en varm drikke.</p>

                                <div className="d-flex gap-3">
                                    <Button
                                        label="Ta kontakt"
                                        type="secondary"
                                        link="mailto:henrikbaugerod@hotmail.com"
                                    />

                                    {/* <Button
                                        label="Se hva jeg har gjort tidligere"
                                        type="outline-light"
                                        onClick={() => setShowPortfolio(!showPortfolio)}
                                    /> */}
                                </div>
                            </div>
                            <div className="col-md-6 text-center mb-5 order-0 order-md-1">
                                {/* <CountdownWrapper /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const Bubbles = () => {
    const { firstRender } = useConfigContext();

    const introDelay = firstRender ? 4.5 : 0;
    const bubbles: Record<number, { animation: string, animation_duration: number, animation_opacity: number, enter_duration?: number, enter_delay?: number }> = {
        1: { animation: "bounce", animation_duration: 10, animation_opacity: 0.8, enter_duration: 1, enter_delay: 0.5 + introDelay },
        2: { animation: "bounce", animation_duration: 13, animation_opacity: 1, enter_duration: 1.5, enter_delay: 1 + introDelay },
        3: { animation: "bounce", animation_duration: 10, animation_opacity: 0.8, enter_duration: 1.75, enter_delay: 0.5 + introDelay },
        4: { animation: "bounce", animation_duration: 12, animation_opacity: 1, enter_duration: 1, enter_delay: 0.3 + introDelay },
        5: { animation: "", animation_duration: 12, animation_opacity: 0.8 },
        6: { animation: "bounce", animation_duration: 8, animation_opacity: 0.8, enter_duration: 1.75, enter_delay: 2 + introDelay },
        7: { animation: "bounce", animation_duration: 12, animation_opacity: 1, enter_duration: 1.25, enter_delay: 0.75 + introDelay },
        8: { animation: "bounce", animation_duration: 8, animation_opacity: 0.8, enter_duration: 1, enter_delay: 0 + introDelay },
        9: { animation: "bounce", animation_duration: 11, animation_opacity: 0.8, enter_duration: 3, enter_delay: 0.75 + introDelay },
        10: { animation: "bounce", animation_duration: 7, animation_opacity: 1, enter_duration: 1.5, enter_delay: 0.75 + introDelay },
        11: { animation: "scale", animation_duration: 12, animation_opacity: 1 },
        12: { animation: "scale", animation_duration: 8, animation_opacity: 0.3 },
        13: { animation: "bounce", animation_duration: 11, animation_opacity: 1, enter_duration: 1.25, enter_delay: 0 + introDelay },
        14: { animation: "scale", animation_duration: 6, animation_opacity: 1 },
        // Add more bubble configs as needed
    };

    return (
        <div className="bubbles-container">
            {Object.entries(bubbles).sort(([a], [b]) => Number(b) - Number(a)).map(([key, config]) => (
                <AnimatePresence>
                    <div
                        className={`bubble ${config.animation}`}
                        key={key}
                        style={{
                            animationName: config.animation,
                            animationDuration: `${config.animation_duration}s`,
                            opacity: config.animation_opacity,
                        }}
                    >
                        <motion.img
                            key={key}
                            src={`/bubbles/${key}.png`}
                            initial={{ y: config.enter_duration ? "-100%" : 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: config.enter_duration, delay: config.enter_delay }}

                        />
                        {/* <img src={`src/assets/img/bg/${key}.png`} alt={`Bubble ${key}`} /> */}
                    </div>
                </AnimatePresence>
            ))}
        </div>
    );
}

/* const CountdownWrapper = () => {
    const targetDate = new Date("2025-04-22T00:00:00");

    const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
        if (completed) {
            // Render a completed state
            return <div className="countdown-number">Jeg har burdsdag!</div>;
        } else {
            // Render a countdown with leading zeros
            const formatWithLeadingZero = (num: number) => String(num).padStart(2, "0");

            return (
                <div className="d-flex justify-content-center align-items-center">
                    <div className="countdown-box">
                        <span className="countdown-number">{formatWithLeadingZero(days)}</span>
                        <span className="countdown-label">Dager</span>
                    </div>
                    <div className="countdown-dot" />
                    <div className="countdown-box">
                        <span className="countdown-number">{formatWithLeadingZero(hours)}</span>
                        <span className="countdown-label">Timer</span>
                    </div>
                    <div className="countdown-dot" />
                    <div className="countdown-box">
                        <span className="countdown-number">{formatWithLeadingZero(minutes)}</span>
                        <span className="countdown-label">Minutter</span>
                    </div>
                    <div className="countdown-dot" />
                    <div className="countdown-box">
                        <span className="countdown-number">{formatWithLeadingZero(seconds)}</span>
                        <span className="countdown-label">Sekunder</span>
                    </div>
                </div>
            )
        }
    };

    return (
        <Countdown
            date={targetDate}
            renderer={renderer}
        />
    );
} */

export default Homepage;