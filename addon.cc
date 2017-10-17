#include <napi.h>


class ErrorAsyncWorker : public Napi::AsyncWorker
{
public:
  ErrorAsyncWorker(
    const Napi::Function& callback,
    Napi::Error error
  ) : Napi::AsyncWorker(callback), error(error)
  {
  }

protected:
  void Execute() override
  {
    // Do nothing...?
  }

  void OnOK() override
  {
    Napi::Env env = Env();

    Callback().MakeCallback(
      Receiver().Value(),
      {
        error.Value(),
        env.Undefined()
      }
    );
  }

  void OnError(const Napi::Error& e) override
  {
    Napi::Env env = Env();

    Callback().MakeCallback(
      Receiver().Value(),
      {
        e.Value(),
        env.Undefined()
      }
    );
  }

private:
  Napi::Error error;
};


class SumAsyncWorker : public Napi::AsyncWorker
{
public:
  SumAsyncWorker(
    const Napi::Function& callback,
    const double arg0,
    const double arg1
  ) : Napi::AsyncWorker(callback), arg0(arg0), arg1(arg1), sum(0)
  {
  }

protected:
  void Execute() override
  {
    sum = arg0 + arg1;
  }

  void OnOK() override
  {
    Napi::Env env = Env();

    Callback().MakeCallback(
      Receiver().Value(),
      {
        env.Null(),
        Napi::Number::New(env, sum)
      }
    );
  }

  void OnError(const Napi::Error& e) override
  {
    Napi::Env env = Env();

    Callback().MakeCallback(
      Receiver().Value(),
      {
        e.Value(),
        env.Undefined()
      }
    );
  }

private:
  double arg0;
  double arg1;
  double sum;
};


void SumAsyncCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  //
  // Account for known potential issues that MUST be handled by
  // synchronously throwing an `Error`
  //
  if (info.Length() < 3) {
    Napi::TypeError::New(env, "Invalid argument count").ThrowAsJavaScriptException();
    return;
  }

  if (!info[2].IsFunction()) {
    Napi::TypeError::New(env, "Invalid argument types").ThrowAsJavaScriptException();
    return;
  }


  //
  // Handle all other potential issues asynchronously via the provided callback
  //

  Napi::Function cb = info[2].As<Napi::Function>();

  if (info.Length() != 3) {
    (new ErrorAsyncWorker(cb, Napi::TypeError::New(env, "Invalid argument count")))->Queue();
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber()) {
    (new ErrorAsyncWorker(cb, Napi::TypeError::New(env, "Invalid argument types")))->Queue();
  }
  else {
    double arg0 = info[0].As<Napi::Number>().DoubleValue();
    double arg1 = info[1].As<Napi::Number>().DoubleValue();

    (new SumAsyncWorker(cb, arg0, arg1))->Queue();
  }

  return;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(
    Napi::String::New(env, "add"),
    Napi::Function::New(env, SumAsyncCallback)
  );
  return exports;
}


NODE_API_MODULE(addon, Init)
