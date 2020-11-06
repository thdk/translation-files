import { processTranslation } from "./process-translation";

const write = jest.fn();

afterEach(jest.clearAllMocks);

describe("processTranslation", () => {
    it("should call write for key, default and description", () => {
        processTranslation(
            {
                name: {
                    key: "name",
                    default: "default name",
                    description: "description name",
                },
                firstName: {
                    key: "first-name",
                    default: "default first name",
                    description: "description first name",
                },
            },
            write,
            "key",
            "",
            ""
        );

        expect(write).toHaveBeenCalledWith("key:name");
        expect(write).toHaveBeenCalledWith("description:description name");
        expect(write).toHaveBeenCalledWith("default:default name");

        expect(write).toHaveBeenCalledWith("key:first-name");
        expect(write).toHaveBeenCalledWith("description:description first name");
        expect(write).toHaveBeenCalledWith("default:default first name");
    });

    it("should call write with remaining properties of translation object", () => {
        processTranslation(
            {
                todoSummary: {
                    key: "todo-summary",
                    default: "You have completed {0}/{1} items",
                    0: "Number of finished items",
                    1: "Total number of items",
                },
            },
            write,
            "key",
            "",
            ""
        );

        expect(write).toHaveBeenCalledWith("key:todo-summary");
        expect(write).toHaveBeenCalledWith("default:You have completed {0}/{1} items");

        expect(write).toHaveBeenCalledWith("0Number of finished items");
        expect(write).toHaveBeenCalledWith("1Total number of items");
    });

    it("should work with nested translation objects", () => {
        processTranslation({
            person: {
                name: {
                    key: "name",
                    default: "default name",
                    description: "description name",
                },
                firstName: {
                    key: "first-name",
                    default: "default first name",
                    description: "description first name",
                },
            },
            adress: {
                line1: {
                    key: "address-line-1",
                    default: "street",
                },
                line2: {
                    key: "address-line-2",
                    default: "city",
                },
            }
        },
            write,
            "key",
            "",
            ""
        );

        expect(write).toHaveBeenCalledWith("key:name");
        expect(write).toHaveBeenCalledWith("description:description name");
        expect(write).toHaveBeenCalledWith("default:default name");

        expect(write).toHaveBeenCalledWith("key:first-name");
        expect(write).toHaveBeenCalledWith("description:description first name");
        expect(write).toHaveBeenCalledWith("default:default first name");

        expect(write).toHaveBeenCalledWith("key:address-line-1");
        expect(write).toHaveBeenCalledWith("default:street");

        expect(write).toHaveBeenCalledWith("key:address-line-2");
        expect(write).toHaveBeenCalledWith("default:city");
    });

    it("should work with multi level nested translation objects", () => {
        processTranslation({
            adress: {
                myAddresses: {
                    key: "my-addresses",
                    default: "My addresses",
                    description: "Displayed on top of addresses page"
                },
                delivery: {
                    line1: {
                        key: "delivery-address-line-1",
                        default: "street",
                    },
                    line2: {
                        key: "delivery-address-line-2",
                        default: "city",
                    },
                },
                billing: {
                    line1: {
                        key: "billing-address-line-1",
                        default: "street",
                    },
                    line2: {
                        key: "billing-address-line-2",
                        default: "city",
                    },
                }

            }
        },
            write,
            "key",
            "",
            ""
        );


        expect(write).toHaveBeenCalledWith("key:my-addresses");
        expect(write).toHaveBeenCalledWith("description:Displayed on top of addresses page");
        expect(write).toHaveBeenCalledWith("default:My addresses");

        expect(write).toHaveBeenCalledWith("key:delivery-address-line-1");
        expect(write).toHaveBeenCalledWith("default:street");

        expect(write).toHaveBeenCalledWith("key:delivery-address-line-2");
        expect(write).toHaveBeenCalledWith("default:city");

        expect(write).toHaveBeenCalledWith("key:billing-address-line-1");
        expect(write).toHaveBeenCalledWith("default:street");

        expect(write).toHaveBeenCalledWith("key:billing-address-line-2");
        expect(write).toHaveBeenCalledWith("default:city");
    });

    it("should work with string as translation object (key)", () => {
        processTranslation(
            {
                open: "open",
            },
            write,
            "key",
            "",
            "",
        );

        expect(write).toHaveBeenCalledWith("key:open");
    });
});
