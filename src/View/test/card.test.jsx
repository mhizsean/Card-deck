import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Cards from "../Cards";
import axios from "axios";

jest.mock("axios");

let mockId = "f8inufsyt6k0";
let mockImage = "https://deckofcardsapi.com/static/img/4D.png";


beforeEach(() => {
    axios.get.mockClear();

    axios.get.mockImplementation((url) => {
        if (url.includes("/new/shuffle")) {
            return Promise.resolve({
                data: { deck_id: mockId },
            });
        } else if (url.includes("/draw")) {
            return Promise.resolve({
                data: {
                    cards: [
                        {
                            image: "mockImage",
                            value: "5",
                            suit: "Hearts",
                        },
                    ],
                },
            });
        }
    });
});


describe("Initializing the deck", () => {
    it("fetches and sets the deck ID on mount", async () => {
        render(<Cards />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
            );
        });

        await waitFor(() => {
            expect(
                screen.getByRole("button", {
                    label: /draw card/i,
                }),
            ).toBeInTheDocument();
        });
    });
});

describe("Drawing a card", () => {
    it("draws a card and updates the UI when the draw card button is clicked", async () => {
        render(<Cards />);

        const drawButton = await screen.findByRole("button", {
            label: /draw card/i,
        });

        fireEvent.click(drawButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                "https://deckofcardsapi.com/api/deck/f8inufsyt6k0/draw/?count=1",
            );
        });

        await waitFor(() => {
            // Ensure that a card with specific alt text appears in the document
            expect(screen.getByAltText("5 of Hearts")).toBeInTheDocument();
        });
    });
});

describe("Snap Suit Functionality", () => {
    it("displays no message when theres no match", async () => {
        render(<Cards />);
        const drawButton = await screen.findByRole("button", {
            name: /draw card/i,
        });
        axios.get.mockResolvedValueOnce({
            data: {
                cards: [{ image: mockImage, value: "5", suit: "Hearts" }],
            },
        });

        fireEvent.click(drawButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        axios.get.mockResolvedValueOnce({
            data: {
                cards: [{ image: mockImage, value: "6", suit: "Diamonds" }],
            },
        });

        fireEvent.click(drawButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.queryByRole(/snap suit/i)).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.queryByRole(/snap value/i)).not.toBeInTheDocument();
        });
    });

    it('displays "SNAP SUIT!" when two consecutive cards have the same suit', async () => {

        render(<Cards />);
        const drawButton = await screen.findByRole("button", {
            name: /draw card/i,
        });

        axios.get.mockResolvedValueOnce({
            data: {
                cards: [{ image: mockImage, value: "5", suit: "Hearts" }],
            },
        });

        fireEvent.click(drawButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        axios.get.mockResolvedValueOnce({
            data: {
                cards: [{ image: mockImage, value: "6", suit: "Hearts" }],
            },
        });

        fireEvent.click(drawButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText(/snap suit/i)).toBeInTheDocument();
        });
    });

    it('displays "SNAP VALUE!" when two consecutive cards have the same value', async () => {
        render(<Cards />);
        const drawButton = await screen.findByRole("button", {
            name: /draw card/i,
        });

        axios.get.mockResolvedValueOnce({
            data: {
                cards: [{ image: mockImage, value: "5", suit: "Hearts" }],
            },
        });

        fireEvent.click(drawButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        axios.get.mockResolvedValueOnce({
            data: {
                cards: [{ image: mockImage, value: "5", suit: "Diamonds" }],
            },
        });
        fireEvent.click(drawButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText(/snap value/i)).toBeInTheDocument();
        });
    });
});

