import {setLocalStorage} from "../../setup-jest"
import { fireEvent, screen} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import firestore from "../app/Firestore.js"

// Setup
const onNavigate = () => {return}
setLocalStorage('Employee')
Object.defineProperty(window, "location", { value: { hash: "#employee/bill/new" } })

describe("Given I am connected as an employee", () => {
  describe("When I access NewBill Page", () => {
    test("Then the newBill page should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
    test("Then a form with nine fields should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      const form = document.querySelector("form")
      expect(form.length).toEqual(9)
    })
  })
  //On est sensé écrire des tests pour la méthode handleChangeFile de NewBill alors qu'elle utilise this.firestore.
  // Solution import de Firestore.js et le mettre dans un faux new NewBill puis utiliser un FireEvent pour simuler un changement de fichier

  describe("When I'm on NewBill Page", () => {
    describe("And I upload a image file", () => {
      test("Then the file handler should show a file", () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })],
          }
        })
        const numberOfFile = screen.getByTestId("file").files.length
        expect(numberOfFile).toEqual(1)
      })
    })
    /**
     * Scénario 10
     */
    describe("And I upload a non-image file", () => {
      test("Then an error message should be display", async () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })],
          }
        })
        expect(handleChangeFile).toBeCalled()
        expect(inputFile.files[0].name).toBe("sample.txt")
        expect(document.querySelector(".error-imageFormat").style.display).toBe("block")
      })
    })
    /**
     * Scénario 12
     */
    describe("And I submit a valid bill form", () => {
      test('then a bill is created', async () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const submit = screen.getByTestId('form-new-bill')
        const validBill = {
          name: "validBill",
          date: "2021-01-01",
          type: "Equipement et matériel",
          amount: 174,
          pct: 20,
          vat: "29",  
          fileName: "facture_test_np78he.png",
          fileUrl: "https://res.cloudinary.com/dlbeahxzz/image/upload/v1628664243/facture_test_np78he.png"
        }
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        newBill.createBill = (newBill) => newBill
        document.querySelector(`input[data-testid="expense-name"]`).value = validBill.name
        document.querySelector(`input[data-testid="datepicker"]`).value = validBill.date
        document.querySelector(`select[data-testid="expense-type"]`).value = validBill.type
        document.querySelector(`input[data-testid="amount"]`).value = validBill.amount
        document.querySelector(`input[data-testid="vat"]`).value = validBill.vat
        document.querySelector(`input[data-testid="pct"]`).value = validBill.pct
        document.querySelector(`textarea[data-testid="commentary"]`).value = validBill.commentary
        newBill.fileUrl = validBill.fileUrl
        newBill.fileName = validBill.fileName
        submit.addEventListener('click', handleSubmit)
        fireEvent.click(submit)
        expect(handleSubmit).toHaveBeenCalled()
      })
    })
  })

})